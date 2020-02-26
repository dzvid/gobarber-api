module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' }, // FK
      onUpdate: 'CASCADE', // Se o avatar for atualizado, a alteração deve ser refletida na tabela users
      onDelete: 'SET NULL', // Se o arquivo for excluido, setar o valor default como NULL
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
