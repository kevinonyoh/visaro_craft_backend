'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('chat_messages', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      sender_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      receiver_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      sender_type: {
        type: Sequelize.ENUM('admin', 'user'),
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
      
    });
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
