import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  /**
   * Lista as notificações de um usuário ( provedor de serviços)
   * @param {*} req
   * @param {*} res
   * @return {res.JSON.notifications} Lista de notificações
   */
  async index(req, res) {
    // Verificamos se o usuário logado é um prestador de serviços
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Only a provider can load notifications' });
    }

    // Listamos as notificações do provedor de serviços do agendamento mais recente
    // criado para o mais antigo
    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }
}

export default new NotificationController();
