'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('activities', 'agentId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'agents',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('activities', 'amount', {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
