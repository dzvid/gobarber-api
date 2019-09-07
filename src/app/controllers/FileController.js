import File from '../models/File';

class FileController {
  // Salva as informações do arquivo avatar no banco de dados
  async store(req, res) {
    // Buscamos dados do req.file processado pelo multer
    // O originalname será salvo no bd como name
    // O filename será salvo no bd como path
    const { originalname: name, filename: path } = req.file;

    // Persistimos a referencia do arquivo no banco de dados e retornamos a referencia ao usuario
    const file = await File.create({
      name,
      path,
    });

    return res.json({ file });
  }
}

export default new FileController();
