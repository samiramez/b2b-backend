'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const bcrypt = require('bcrypt');
    module.exports = {
      up: async (qi) => {
        const hash = await bcrypt.hash('Admin123!', 10);
        await qi.bulkInsert('Users', [
          { email: 'admin@example.com', passwordHash: hash, role: 'admin', createdAt: new Date(), updatedAt: new Date() },
          { email: 'cust@example.com', passwordHash: hash, role: 'customer', createdAt: new Date(), updatedAt: new Date() },
          { email: 'supplier@example.com', passwordHash: hash, role: 'supplier', createdAt: new Date(), updatedAt: new Date() }
        ]);
      },
      down: (qi) => qi.bulkDelete('Users', null, {})
    };

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
