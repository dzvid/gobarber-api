import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';

class AppointmentController {
  /**
   * O método index: Permite a listagem de agendamentos de um usuário
   */
  async index(req, res) {
    // Consulto todos os agendamentos do usuário que ainda não foram cancelados
    // Retornando os agendamentos existentes ordenados por data e inclue as informações dos
    // prestadores de serviços (dados do provider e o  avatar do provider)
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      attributes: ['id', 'date'],
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
   * o provider_id e a data do agendamento.
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

    // Verificamos se o provider_id fornecido corresponde a um provider
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    // Caso o provider_id fornecido seja inválido
    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
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

    return res.json(newAppointment);
  }
}

export default new AppointmentController();
