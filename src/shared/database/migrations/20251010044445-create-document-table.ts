'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('documents', {

      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      petition_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'petitions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      file_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      file_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      public_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      uploaded_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
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
