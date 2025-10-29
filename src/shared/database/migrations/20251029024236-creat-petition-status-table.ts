'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('petitions', 'status', {
      type: Sequelize.ENUM('pending', 'in_progress', 'completed'),
      allowNull: false,
      defaultValue: 'pending', 
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
