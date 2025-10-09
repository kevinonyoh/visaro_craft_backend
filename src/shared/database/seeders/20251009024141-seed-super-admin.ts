'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await bcrypt.hash('SuperAdmin@123', 10); 

    await queryInterface.bulkInsert('admins', [
      {
        id: uuidv4(),
        first_name: 'Super',
        last_name: 'Admin',
        email: 'superadmin@example.com',
        password: password,
        is_activated: true,
        is_email_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admins', { email: 'superadmin@example.com' }, {});
  },
};
