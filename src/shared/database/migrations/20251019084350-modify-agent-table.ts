'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize').Migration} */
module.exports = {
  async up(queryInterface) {
    // await queryInterface.addColumn('agents', 'username', {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   unique: true,
    // });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('agents', 'username');
  },
};
