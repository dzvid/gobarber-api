import User from '../models/User';
import File from '../models/File';
// Lida com as funcionalidades e regras de negocio especificas para um usuario do tipo provider
class ProviderController {
  // Lista os providers (prestadores de serviço) da aplicação (apenas usuarios autenticados podem
  // solicitar a lista de providers).
  // Returns the provider id, name, email and avatar_id info.
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(providers);
  }
}

export default new ProviderController();
