// Resumo do arquivo: é o Loader dos models, Conecta com a base de dados e carrega os models da aplicação
import Sequelize from 'sequelize';
// Importamos nossos models
import User from '../app/models/User';
import File from '../app/models/File';

// Importamos as configurações do banco de dados
import databaseConfig from '../config/database';

// Array com todos os models da aplicação
const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  // Conecta com a base de dados e carrega os models da aplicação
  init() {
    // Crio a conexão com a base de dados (é o parametro esperado pelo super.init() do model) )
    this.connection = new Sequelize(databaseConfig);

    // Percorro todos os models da aplicação passando a conexão com o bd
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models)); // Carrega os relacionamentos entre tabelas que possuem o método associate
  }
}

export default new Database();
