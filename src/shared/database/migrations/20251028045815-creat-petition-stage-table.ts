'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('petition_stages', {
      
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      
      petition_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'petitions',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      
      week_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      
      stage: {
        type: Sequelize.ENUM(
          'REVIEW',
          'COVER_LETTER_AND_CRITERIA_MET',
          'US_BENEFIT_AND_ENDEAVOR',
          'FINAL_MERIT_AND_CONCLUSION',
          'EXHIBITS_AND_FINAL_REVIEW'
        ),
        allowNull: false,
      },
      
      status: {
        type: Sequelize.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETE'),
        defaultValue: 'PENDING',
      },
      
      started_at: {
        type: Sequelize.DATE,
      },
      
      completed_at: {
        type: Sequelize.DATE,
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

  async down(queryInterface) {
    await queryInterface.dropTable('petition_stages');
  },
};
