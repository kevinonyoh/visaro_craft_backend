'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('petitions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      petition_type: {
        type: Sequelize.ENUM(
          'EXTRAORDINARY_ABILITY',
          'NATIONAL_INTEREST_WAIVER',
          'EXTRAORDINARY_TALENT'
        ),
        allowNull: false,
      },
      petition_status: {
        type: Sequelize.ENUM('PENDING', 'DECLINED', 'APPROVED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      petition_timeline: {
        type: Sequelize.ENUM(
          'REVIEW',
          'COVER_LETTER_AND_CRITERIA_MET',
          'US_BENEFIT_AND_ENDEAVOR',
          'FINAL_MERIT_AND_CONCLUSION',
          'EXHIBITS_AND_FINAL_REVIEW'
        ),
        allowNull: true,
      },
      is_petition_activated: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'in_progress', 'completed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
     
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('petitions');
  },
};
