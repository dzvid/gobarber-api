import express from 'express';
import path from 'path';
import routes from './routes';

// Importo o loader de models
import './database';

class App {
  constructor() {
    // Iniciamos o servidor
    this.server = express();

    this.middlewares();
    this.routes();
  }

  // Método com implementação de todos os middlewares da aplicação
  middlewares() {
    // Configuro envio e recebimento de requisições no formato JSON
    this.server.use(express.json());

    // Configuramos a rota que servirá conteúdo estático
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  // Método que configura quais rotas o servidor disponibilizará
  routes() {
    // Configuro as rotas do servidor, passando o arquivo de rotas como parametro
    this.server.use(routes);
  }
}

// Exporto uma instancia da aplicação
// O server é a unica instancia que pode ser acessada de fora da classe
export default new App().server;
