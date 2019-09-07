import jwt from 'jsonwebtoken';
// Biblioteca usada para validar dados de entrada do usuário
import * as Yup from 'yup';

// Importamos nosso model de usuario
import User from '../models/User';

// Importo minhas configurações para gerar o token JWT
import authConfig from '../../config/auth';

class SessionController {
  // Criação de sessão
  async store(req, res) {
    // Validando dados da requisição
    // Crio a schema (mascara) de validação
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    // Verifico se a requisição (body) está de acordo com o schema
    // Se retornar não, retorna mensagem de erro.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    // Se dados forem válidos (formato), extraio informações para criar a sessão
    const { email, password } = req.body;

    // Verifico se o usuário (com o email informado) existe na base de dados
    const user = await User.findOne({ where: { email } });
    // Se usuário nao existir, retorno erro
    if (!user) {
      return res.status(401).json({ error: 'User not found!' });
    }

    // Caso usuário exista verifico se a senha é válida
    // Se a senha for inválida, retorno erro
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match!' });
    }

    // Caso o usuário exista e a senha seja válida, gero o token JWT com o método sign
    // A partir do momento que o usuário faz login no sistema,
    // retorno o id, nome, email do usuário, além do token
    // Hash MD5 usado: The MD5 hash for gobarberbootcamp8 is : 08f2aef506551a4c9eb80c3bd59b55a6
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
