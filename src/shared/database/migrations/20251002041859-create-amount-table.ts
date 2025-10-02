'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("payment_options", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.ENUM('consultation', 'first_installment', 'second_installment'),
        allowNull: false,
        unique: true,
      },

      amount: {
        type: Sequelize.INTEGER, 
        allowNull: false,
      },

      currency: {
        type: Sequelize.STRING,
        defaultValue: 'usd',
        allowNull: false,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
    
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }

    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('payment_options');
  }
};
