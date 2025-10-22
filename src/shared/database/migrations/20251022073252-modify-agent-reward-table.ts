'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    // await queryInterface.removeColumn('agent-rewards', 'referral_name');

   
    // await queryInterface.addColumn('agent-rewards', 'user_id', {
    //   type: Sequelize.UUID,
    //   allowNull: false,
    //   references: {
    //     model: 'users',
    //     key: 'id',
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'CASCADE',
    // });

   
    await queryInterface.addColumn('agent-rewards', 'stage_temp', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    
    await queryInterface.sequelize.query(`
      UPDATE "agent-rewards"
      SET stage_temp = CASE 
        WHEN stage = 'PENDING' THEN 0
        WHEN stage = 'IN_PROGRESS' THEN 1
        WHEN stage = 'COMPLETED' THEN 2
        ELSE 0
      END;
    `);

    
    await queryInterface.removeColumn('agent-rewards', 'stage');

    
    await queryInterface.renameColumn('agent-rewards', 'stage_temp', 'stage');

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
