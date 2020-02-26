import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
// Precisa definir o locale do datefns para portugues
import pt from 'date-fns/locale/pt';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

// Gerenciamento da fila do serviço de envio de email
import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  /**
   * O método index: Permite a listagem de agendamentos de um usuário
   */
  async index(req, res) {
    // TODO - Verificar se o valor de page é valido (page>=1)

    // Paginacao de agendamentos, se não for informado será retornado o padrão a pagina 1
    // São retornados no máximo 20 registros por vez
    const { page = 1 } = req.query;

    // Consulto todos os agendamentos do usuário que ainda não foram cancelados
    // Retornando os agendamentos existentes ordenados por data e inclue as informações dos
    // prestadores de serviços (dados do provider e o  avatar do provider)
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      order: ['date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  /**
   *  O método store: Permite um usuário agendar um serviço com um provider (ou seja,
   * permite criar um agendamento). Para criar um agendamento é necessário o user_id,
   * o provider_id e a data do agendamento. Se o agendamento for criado com sucesso, o
   * provider deve ser notificado.
   * Um usuario só pode criar um agendamento com um provider. Lembrando que um provider
   * também é um usuário. Um usuario/provider não pode criar um agendamento consigo mesmo.
   * A tabela abaixo é uma ajuda:
   * Usuario | criar agendamento com
   * user       -> user     | Não pode
   * user       -> provider | ok
   * provider   -> provider | ok (Se for o mesmo provider, então não pode)
   * provider   -> user     | Não pode
   */
  async store(req, res) {
    // Criamos o schema do Yup para validação da requisição
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    // Validamos a requisição
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Appointment parameters validation failed' });
    }

    // Extraimos as informações para criar o agendamento
    const { provider_id, date } = req.body;

    // Verifica se o usuario não está tentando criar um appointment consigo mesmo
    if (provider_id === req.userId) {
      return res
        .status(401)
        .json({ error: 'User can not create an appointment with himself' });
    }

    // Verificamos se o provider_id fornecido corresponde a um provider
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    // Caso o provider_id fornecido seja inválido
    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'User can only create appointments with providers' });
    }

    // Configura o horario recebido para ficar apenas com a hora, zerando minutos e segundos
    const hourStart = startOfHour(parseISO(date));

    // Verificar se a data de agendamento é uma data no passado (se verdadeiro é inválida)
    // comparando a data de agendamento com a data atual
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are note permitted' });
    }

    // Verificar se o prestador de serviço e o usuário estão com o horario indicado disponivel para agendamento
    const checkAvailabilityProvider = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    const checkAvailabilityUser = await Appointment.findOne({
      where: {
        user_id: req.userId,
        canceled_at: null,
        date: hourStart,
      },
    });

    // Se o provedor de serviço ou o usuário outro estiverem com o horário reservado
    // no horario informado, retorna mensagem informando indisponibilidade no horario requisitado
    if (checkAvailabilityProvider || checkAvailabilityUser) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available, date reserved' });
    }

    // Se o provider_id for válido e o horário dele está disponivel, então podemos criar um agendamento
    const newAppointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    /*
     * Notifica novo agendamento ao prestador de serviço
     */

    // Buscamos as informacoes do usuario
    const user = await User.findByPk(req.userId);

    // Formatamos a data de agendamento para exibição, e.g: dia 23 de Junho, às 8:40h
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    // Geramos a notificacao
    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id,
    });

    return res.json(newAppointment);
  }

  /**
   * Permite o usuário realizar o cancelamento de um agendamento. O sistema notifica
   * o prestador de serviço via email sobre o cancelamento.
   * @param {*} req
   * @param {*} res
   */
  async delete(req, res) {
    // TODO - Validar a existencia do id recebido
    // Buscamos o agendamento e também as informações sobre o respectivo usuário e
    //  prestador de serviços para envio de email avisando sobre cancelamento
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    // TODO - Verificar se um prestador de serviços pode cancelar um agendamento
    // Verificamos se o agendamento pertence ao usuario logado
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: 'You dont have permission to cancel this appointment',
      });
    }

    // Verificamos se o cancelamento está sendo executado até 02 horas antes do
    // horário marcado para o agendamento.
    // Removo duas horas do horário marcado e comparo com o horário atual,
    // assim verifico se está no intervalo de cancelamento.
    // Ex: Hora do agendamento.: 13:00h
    //    dateWithSub: 11:00h (hora limite para cancelar uma consulta)
    //    Date: 11:25h (hora atual)
    //    Nesse caso o dateWithSub é antes do Date, assim já passou do horário
    // em que o cancelamento é permitido.
    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res
        .status(401)
        .json({ error: 'You can only cancel appointments 2 hours in advance' });
    }

    // Caso o usuario esteja autorizado e  esteja dentro do intervalo de tempo,
    // realizo o cancelamento (registro a data em que o agendamento foi cancelado).
    // e retorno o agendamento cancelado.
    appointment.canceled_at = new Date();

    await appointment.save();

    // Envio email de cancelamento ao provedor de serviços
    await Queue.add(CancellationMail.key, { appointment });

    return res.json(appointment);
  }
}

export default new AppointmentController();
