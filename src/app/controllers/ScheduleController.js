import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import Appointment from '../models/Appointment';

/**
 * O controller cuida dos agendamentos do provedor de serviços
 */
class ScheduleController {
  /**
   * Listagem dos agendamentos de um provedor de seviços.
   * @param {int} req.date - Data para realizar a consulta
   * @return {json} appointments - Lista de agendamentos do dia.
   */
  async index(req, res) {
    /**
     * Verificamos se o usuário logado é um prestador de serviços
     */
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    /** Obtém da requisição o dia que deseja realizar a consulta de agendamentos
     * (default é o dia atual).
     * Ex: Para o dia 2019-06-22 considera o intervalo entre 00:00:00 e 23:59:59
     * Retorna todas as consultas que não foram canceladas no dia ordenadas por data.
     */
    const { date } = req.query;

    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
