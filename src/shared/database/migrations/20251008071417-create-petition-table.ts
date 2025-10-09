'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("petitions", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
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
        type: Sequelize.ENUM("EXTRAORDINARY_ABILITY", "EXTRAORDINARY_TALENT", "NATIONAL_INTEREST_WAIVER"),
        allowNull: false
      },

      petition_status: {
        type: Sequelize.ENUM("PENDING", "DECLINED", "APPROVED"),
        allowNull: false,
        defaultValue: "PENDING"
      },

      petition_timeline: {
        type: Sequelize.ENUM("REVIEW",
         "COVER_LETTER_AND_CRITERIA_MET", 
         "US_BENEFIT_AND_ENDEAVOR", 
         "FINAL_MERIT_AND_CONCLUSION", 
         "EXHIBITS_AND_FINAL_REVIEW"),
         allowNull: true
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
