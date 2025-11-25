'use strict';

import { IPetitionStatus, IPetitionTimeline, IPetitionType } from "src/modules/petition/interface/petition.interface";

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
        type: Sequelize.ENUM(...Object.values(IPetitionType)),
        allowNull: false,
      },
      petition_status: {
        type: Sequelize.ENUM(...Object.values(IPetitionStatus)),
        allowNull: false,
        defaultValue: IPetitionStatus.PENDING,
      },
      petition_timeline: {
        type: Sequelize.ENUM(...Object.values(IPetitionTimeline)),
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
