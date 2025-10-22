'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable("agent-rewards", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      referral_name: {
        type: Sequelize.STRING(128),
        allowNull: false
      },

      stage: {
        type: Sequelize.STRING(128),
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM("PENDING", "IN_PROGRESS", "COMPLETED"),
        defaultValue: "PENDING"
      },

      reward_amount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
