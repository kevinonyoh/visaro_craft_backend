'use strict';

import { IPetitionTimeline } from "src/modules/petition/interface/petition.interface";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('petition_stages', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
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
      
      week_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      
      stage: {
        type: Sequelize.ENUM(...Object.values(IPetitionTimeline)),
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETE'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      pending_since: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      weekly_review_file: {
        type: Sequelize.STRING,
        allowNull: true,
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('petition_stages');
  },
};
