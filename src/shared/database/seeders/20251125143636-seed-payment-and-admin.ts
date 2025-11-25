'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Seed payment_options table
    await queryInterface.bulkInsert('payment_options', [
      {
        id: Sequelize.UUIDV4(),
        name: 'CONSULTATION',
        amount: 250,
        currency: 'usd',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.UUIDV4(),
        name: 'PETITION_PREPARATION',
        amount: 4000,
        currency: 'usd',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.UUIDV4(),
        name: 'REVIEW_PETITION',
        amount: 4000,
        currency: 'usd',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});

    // Seed admins table
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await queryInterface.bulkInsert('admins', [
      {
        id: Sequelize.UUIDV4(),
        first_name: 'Super',
        last_name: 'Admin',
        email: 'superadmin@example.com',
        password: hashedPassword,
        is_email_verified: true,
        is_activated: true,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payment_options', null, {});
    await queryInterface.bulkDelete('admins', null, {});
  }
};
