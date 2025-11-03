'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    // await queryInterface.removeColumn('chat_messages', 'sender_id');

    // await queryInterface.removeColumn('chat_messages', 'receiver_id');

   
    await queryInterface.addColumn('chat_messages', 'user_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users', 
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addColumn('chat_messages', 'admin_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'admins', 
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
