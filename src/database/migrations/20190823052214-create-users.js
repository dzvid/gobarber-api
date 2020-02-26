module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      // Definição das colunas da tabela
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      provider: {
        // provider - true
        // client - false
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      // Timestamps fields
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('users');
  },
};
