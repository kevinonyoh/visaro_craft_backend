'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("payments", {
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

    payment_option_name: {
      type: Sequelize.ENUM("CONSULTATION", "PETITION_PREPARATION", "REVIEW_PETITION"),
      allowNull: false,
    },

    email: {
      type: Sequelize.STRING(128),
      allowNull: false
    },

    stripe_id: {
      type: Sequelize.STRING(128),
      allowNull: true
    },

    stripe_client_secret: {
      type: Sequelize.STRING(128),
      allowNull: true
    },

    petition_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'petitions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },

    payment_options_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'payment_options',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },

    amount : {
      type: Sequelize.INTEGER,
      allowNull: false
    },

    status: {
       type: Sequelize.ENUM("pending", "failed", "successful"),
       defaultValue: "pending"
    },

    created_at: {
      allowNull: false,
      type: Sequelize.DATE
    },
  
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE
    },

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
