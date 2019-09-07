import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

// Middleware para verificar se o usuário está logado
export default async (req, res, next) => {
  // Busco o header da requisição do usuário o qual contém o token JWT
  const authHeader = req.headers.authorization;

  // Caso token não tenha sido enviado na requisição, retorno erro
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided!' });
  }

  // Caso esteja presente, extrai-se o token
  // O formato do token é: "Bearer token" (o split retorna um array, por meio da
  // desestruturação, pegamos apenas o segundo argumento do array)
  const [, token] = authHeader.split(' ');

  try {
    // Decodificando o token JWT usando o promisy
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // Caso de tudo certo, o decoded contém as informações utilizadas quando o token foi gerado
    // Assim validamos se o usuário está autenticado, incluimos o id do usuário na requisição.

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid!' });
  }
};
