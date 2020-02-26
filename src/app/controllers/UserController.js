// Biblioteca usada para validar dados de entrada do usuário
import * as Yup from 'yup';
// (implementando a feature) Criação e registro de usuários
// Importamos o model de usuário
import User from '../models/User';
import File from '../models/File';

class UserController {
  // Cadastro de um usuário (é um middleware)
  async store(req, res) {
    // Validando dados da requisição
    // Crio a schema (mascara) de validação
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    // Verifico se a requisição (body) está de acordo com o schema
    // Se retornar não, retorna mensagem de erro.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    // Verificamos se usuário com email informado já existe
    const userExists = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    // Se existir um usuário
    if (userExists) {
      return res.status(400).json({ error: 'User already exists!' });
    }
    // Se não existir, registro o usuário na aplicação
    // e retorno apenas alguns dados necessários para o frontend
    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  // Alteração dos dados de um usuário
  async update(req, res) {
    // Validando dados da requisição
    // Crio a schema (mascara) de validação
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string()
        .min(6)
        .when('password', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        ),
    });

    // Verifico se a requisição (body) está de acordo com o schema
    // Se retornar não, retorna mensagem de erro.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    // Se dados forem válidos, extraio informações para atualizar os dados
    // do usuário
    const { email, oldPassword } = req.body;

    // Busco o usuário no bd pra verificar e editar suas informações
    const user = await User.findByPk(req.userId);

    // Verifica se o email que o usuario deseja editar é diferente
    // do email ele possui (também verifica se o email já está sendo usado por outro usuário)
    if (email !== user.email) {
      // Verificamos se usuário com email informado já existe
      const userExists = await User.findOne({ where: { email } });

      // Se existir um usuário
      if (userExists) {
        return res.status(400).json({ error: 'User already exists!' });
      }
    }

    // Verifica se a antiga senha foi informada epreencher o campo de senha nova, a senha é trocada
    // (O que está errado, pois a senha só deveria ser trocada se a antiga fosse fornecida)
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match!' });
    }

    // Após verificar e validar os campos de ecistência do usuário e oldPassword
    // Atualizamos as informações do usuário

    await user.update(req.body);

    // Busca a foto de perfil do usuario
    const { id, avatar, name } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attibutes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({ id, avatar, name, email });
  }
}

export default new UserController();
