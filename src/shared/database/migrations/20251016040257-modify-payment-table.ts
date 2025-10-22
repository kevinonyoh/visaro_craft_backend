'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // await queryInterface.removeColumn('payments', 'stripe_client_secret');

    // await queryInterface.renameColumn('payments', 'stripe_id', 'checkout_session_id');

    // await queryInterface.addColumn('payments', 'payment_url', {
    //   type: Sequelize.TEXT,
    //   allowNull: false,
  
    // });

  },

  async down(queryInterface, Sequelize) {
   
    await queryInterface.removeColumn('payments', 'payment_url');
    await queryInterface.removeColumn('payments', 'currency');
    await queryInterface.removeColumn('payments', 'payment_method_type');

    await queryInterface.renameColumn('payments', 'checkout_session_id', 'stripe_id');

    await queryInterface.addColumn('payments', 'stripe_client_secret', {
      type: Sequelize.STRING(128),
      allowNull: true,
    });
  },
};
