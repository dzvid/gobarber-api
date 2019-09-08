import * as Yup from 'yup';

import User from '../models/User';
import Appointment from '../models/Appointment';

class AppointmentController {
  // O método permite um usuário agendar um serviço com um provider (ou seja, permite criar um agendamento)
  // Para criar um agendamento é necessário o provider_id e a data do agendamento
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

    // TODO - Verificar se já há um agendamento no horario desejado com o provider escolhido

    // Se o provider_id for válido, podemos criar um agendamento
    const newAppointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    return res.json(newAppointment);
  }
}

export default new AppointmentController();
