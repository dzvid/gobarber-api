import Sequelize, { Model } from 'sequelize';

// Modulo para gerar hash da senha
import bcrypt from 'bcryptjs';

class User extends Model {
  // Método chamado automaticamente pelo sequelize
  static init(sequelize) {
    // Enviamos apenas as informações das colunas que não são PK, Fk e autocomplete/increment/update
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // Método para gerar o hash da senha do usuário
    // Executado automaticamente sempre que um usuário é criado ou editado
    this.addHook('beforeSave', async user => {
      // O hash é gerado apenas quando um novo password é informado
      // (seja na criação ou edição do usuário)
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    // Retorna o model que foi inicializado
    return this;
  }

  // Criamos o relacionamento entre as tabelas users e files
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  // Verifica se a senha informada por um usuario é valida, comparando com a
  // armazenada na base de dados.
  // Retorna true se for válida, caso contrário retorna false
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
