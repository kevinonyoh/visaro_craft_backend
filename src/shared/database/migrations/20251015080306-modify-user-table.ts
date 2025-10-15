'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('users', 'phone_number', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'country_code', {
      type: Sequelize.STRING(10),
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
