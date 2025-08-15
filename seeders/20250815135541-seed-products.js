'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    module.exports = {
      up: async (qi) => {
        await qi.bulkInsert('Products', [
          { name: 'Widget A', sku: 'WID-A', price: '19.99', description: 'Basic widget', createdAt: new Date(), updatedAt: new Date() },
          { name: 'Widget B', sku: 'WID-B', price: '29.99', description: 'Pro widget', createdAt: new Date(), updatedAt: new Date() }
        ]);
      },
      down: (qi) => qi.bulkDelete('Products', null, {})
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
