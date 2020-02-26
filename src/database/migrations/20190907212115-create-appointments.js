module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      // Definição das colunas da tabela
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      // Data do agendamento
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      // Referencia a um usuario na tabela de users
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }, // FK
        onUpdate: 'CASCADE', // Quando as info de um usuario forem atualizadas, deve refletir no agendamento
        onDelete: 'SET NULL', // Quando um usuario for deletado, todos seus agendamentos ficam com null (para constar no historico de provider)
        allowNull: true,
      },

      // Referencia a um provider na tabela de users
      provider_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }, // FK
        onUpdate: 'CASCADE', // Quando as info de um provider forem atualizadas, deve refletir no agendamento
        onDelete: 'SET NULL', // Quando um provider for deletado, todos seus agendamentos ficam com null (para constar no historico de usuario)
        allowNull: true,
      },

      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

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
    return queryInterface.dropTable('appointments');
  },
};
