'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const password = process.env.ADMIN_PASSWORD;
    const email = process.env.ADMIN_EMAIL;
    const hashedPassword = await bcrypt.hash(password, 10);
    

    await queryInterface.bulkInsert('admins', [
      {
        id: uuidv4(),
        first_name: 'Super',
        last_name: 'Admin',
        email,
        password: hashedPassword,
        is_email_verified: true,
        is_activated: true,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
