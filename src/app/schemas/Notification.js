import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    /** Conteudo da notificacao */
    content: {
      type: String,
      required: true,
    },

    /** id do usuario */
    user: {
      type: Number,
      required: true,
    },

    /** Status da notificacao lida/nao lida */
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    //* * Campos created_at e updated_at */
    timestamps: true,
  }
);

export default mongoose.model('Notification', NotificationSchema);
