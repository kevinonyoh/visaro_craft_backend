'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("agents", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      first_name: {
        type: Sequelize.STRING(128),
        allowNull: false
      },

      last_name: {
        type: Sequelize.STRING(128),
        allowNull: false
      },

      email: {
        type: Sequelize.STRING(128),
        allowNull: false
      },

      password: {
        type: Sequelize.STRING(128),
        allowNull: true
      },

      is_activated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      is_email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      bank: {
        type: Sequelize.JSON,
        allowNull: false
      },

      pin: {
        type: Sequelize.STRING,
        allowNull: false
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
