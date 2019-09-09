import { Router } from 'express';
import multer from 'multer';

// importamos a configuracao do multer
import multerConfig from './config/multer';

// Importamos os controllers
import UserController from './app/controllers/UserController';
import ProviderController from './app/controllers/ProviderController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';

// Importação dos middlewares
// authMiddleware sendo utilizado como middleware local
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Configuramos o upload de arquivos
const upload = multer(multerConfig);

// CONFIGURAÇÃO DAS ROTAS

// Rota de criação de usuário
routes.post('/users', UserController.store);

// Rota de criação de sessão com autenticação JWT
routes.post('/sessions', SessionController.store);

// Middleware para verificar se usuário está logado no sistema
// (prestar atenção com o posição o local que foi declarado)
routes.use(authMiddleware);

// Rota de alteração dos dados de um usuário
routes.put('/users', UserController.update);

// Rota para listar os providers da aplicação
routes.get('/providers', ProviderController.index);

// Rota para listagem de agendamentos de um usuário
routes.get('/appointments', AppointmentController.index);

// Rota para um usuario agendar um serviço com um provider
routes.post('/appointments', AppointmentController.store);

// Rota para listagem de agendamentos de um provedor de serviços
routes.get('/schedule', ScheduleController.index);

// Rota de upload de arquivos (imagem de avatar do usuario)
routes.post('/files', upload.single('file'), FileController.store);

// Exportamos nossas rotas
export default routes;
