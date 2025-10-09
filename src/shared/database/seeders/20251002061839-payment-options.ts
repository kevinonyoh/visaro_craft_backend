'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.bulkInsert('payment_options', [
    //   {
    //     name: 'consultation',
    //     amount: 5000,
    //     currency: 'usd',
    //     created_at: new Date(),
    //     updated_at: new Date(),
    //   },
    //   {
    //     name: 'first_installment',
    //     amount: 20000,
    //     currency: 'usd',
    //     created_at: new Date(),
    //     updated_at: new Date(),
    //   },
    //   {
    //     name: 'second_installment',
    //     amount: 15000,
    //     currency: 'usd',
    //     created_at: new Date(),
    //     updated_at: new Date(),
    //   },
    // ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payment_options', null, {});
  }
};
