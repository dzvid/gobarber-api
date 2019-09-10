import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import { parse } from 'ipaddr.js';
import Mail from '../../lib/Mail';

class CancellationMail {
  /**
   * Retorna um valor (key) unico que identifica a fila, no caso o nome da própria classe
   */
  get key() {
    return 'CancellationMail';
  }

  /**
   * Tarefa executada quando o job é chamado. O método handle é o responsavel por
   * enviar os emails da fila.
   */
  async handle({ data }) {
    const { appointment } = data;
    // TODO - Tratar erro quando nodemail não pode se conectar ao serviço de email
    // Imediatamente após efetivar o cancelamento, envio email ao prestador de serviço
    // informando sobre o cancelamento
    // Formatamos a data de agendamento para exibição, e.g: dia 23 de Junho, às 8:40h
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });

    console.log('Email enviado');
  }
}

export default new CancellationMail();
