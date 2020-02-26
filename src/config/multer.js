import multer from 'multer';
import crypto from 'crypto';
// /extname serve para identificar a extensão de um arquivo
import { extname, resolve } from 'path';

// O multer persiste o avatar do usuario de forma física
// Exportamos um objeto de configuração
export default {
  // Storage define como e onde o multer guarda os arquivos de imagens (disco, CDN, etc)
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      // Define como formatar o nome do arquivo recebido
      // Adicionamos um codigo unico pra cada imagem e contatenamos com a extensao do arquivo
      // enviado pelo usuário
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        // Se não tiver ocorrido erro
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
