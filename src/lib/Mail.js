import nodemailer from 'nodemailer';
import { resolve } from 'path';
// Importamos os modulos do handlebars
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';

import mailConfig from '../config/mail';

/** Classe para envio de emails utilizando o Nodemailer */
class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;
    // criacao da conecao do nodemailer com o servico de email
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null, // Algumas estrategias de envio de email não precisam de autenticação
    });

    this.configureTemplates();
  }

  /**
   * Configuração do template de envio de email de cancelamento
   * @param {*} message
   */
  configureTemplates() {
    // path dos templates
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  /**
   * Método responsavel pelo envio do email
   */
  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
