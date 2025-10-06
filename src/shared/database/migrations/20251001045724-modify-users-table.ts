'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.addColumn('users', 'cv_url', {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });

    // await queryInterface.addColumn('users', 'cv_public_id', {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.removeColumn('users', 'cv_url');
    // await queryInterface.removeColumn('users', 'cv_public_id');
  }
};
