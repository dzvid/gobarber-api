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

  /**
   * Marca uma notificação como lida pelo provedor de serviço
   * @param {string} req.id - id da notificação armazenada
   * @param {*} res
   */
  async update(req, res) {
    // TODO - Validar o id da notificação usando o Yup

    // Verificamos se o usuário logado é um prestador de serviços
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Invalid provider, cant update notification status' });
    }

    // TODO - Verificar se o agendamento está sendo lido pelo provedor de serviços correto
    // Provider David não pode ler as notificacoes do provider Leo, no momento, basta o provider
    // estar logado e alterar o id da notificacao para o de um outro provider e o sistema marcará
    // como lido, esse comportamento esta errado, pode ser feito no bloco de codigo que verifica
    // se o usuario é um provider comparando o provider id com o req.userId.

    // TODO - Tratar verificacao de id de notificacao invalido/mal formado via try/catch
    // e.g: id = 5d76b0a89a64d877d2002376, ok
    //      id = 5d76b0a89a64d877d200237 erro (tem um digito a menos)

    // Consultamos o id, atualizamos seu valor e retornamos o novo valor do registro
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
