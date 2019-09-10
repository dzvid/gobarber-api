import nodemailer from 'nodemailer';
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
