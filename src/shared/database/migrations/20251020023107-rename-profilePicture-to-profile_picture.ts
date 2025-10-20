'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'profilePicture', 'profile_picture');
    await queryInterface.renameColumn('agents', 'profilePicture', 'profile_picture');
    await queryInterface.renameColumn('admins', 'profilePicture', 'profile_picture');
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
