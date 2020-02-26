import 'dotenv/config';

import express from 'express';
import path from 'path';
import cors from 'cors';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import routes from './routes';
import sentryConfig from './config/sentry';

// Importo o loader de models
import './database';

class App {
  constructor() {
    // Iniciamos o servidor
    this.server = express();

    // Monitoramento de erros com Sentry
    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  // Método com implementação de todos os middlewares da aplicação
  middlewares() {
    // The request handler must be the first middleware on the app
    this.server.use(Sentry.Handlers.requestHandler());

    this.server.use(cors());

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

    // The error handler must be before any other error middleware and after all controllers
    this.server.use(Sentry.Handlers.errorHandler());
  }

  /**
   * Método para lidar com exceções/erros
   *  Se estiver executando em ambiente de desenvolvimento retorna o log completo
   * de erro.
   */
  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

// Exporto uma instancia da aplicação
// O server é a unica instancia que pode ser acessada de fora da classe
export default new App().server;
