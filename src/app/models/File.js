import Sequelize, { Model } from 'sequelize';

class File extends Model {
  // Método chamado automaticamente pelo sequelize
  static init(sequelize) {
    // Colunas da nossa tabela
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            // TODO - Refactor hard coded string
            // Returns the avatar url to be accessed from the client
            return `http://localhost:3333/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );
    // Retorna o model que foi inicializado
    return this;
  }
}

export default File;
