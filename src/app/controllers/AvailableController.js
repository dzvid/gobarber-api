import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';

class AvailableController {
  /**
   * O sistema irá listar os horários disponíveis de um determinado prestador
   * de serviços num determinado dia e retornará esta lista ao cliente.
   *
   * @param {*} req
   * @param {*} res
   */
  async index(req, res) {
    const { date } = req.query;

    // TODO - Utilizar yup para realizar a validação do query e route params
    // Verifico se a data existe na requisição
    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    //  Certifico que a data é um número
    const searchDate = Number(date);

    // Realiza a busca no bd dos agendamentos no dia solicitado
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    // Listagem de todos os agendamentos livres do provedor de serviços
    // Horário diário de serviço de um provedor de serviços 08:00 as 19:00
    const scheduleDay = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];

    // Verifica se o horário já passou e se o horário já encontra-se ocupado
    // O value possui o valor de YYYY-MM-DD HH:00:00 (minutos e segundos zerados)
    const available = scheduleDay.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      // isAfter verifica se o horário solicitado é após o horário atual
      // (ou seja, se não passou ainda)
      // !appointment.find() verifica se o horário já está ocupado
      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, 'HH:mm') === time),
      };
    });

    return res.json(available);
  }
}
export default new AvailableController();
