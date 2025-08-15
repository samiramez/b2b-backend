module.exports = {
  up: async (qi) => {
    await qi.bulkInsert('Products', [
      { name:'Widget A', price: '19.99', description:'Basic widget', createdAt:new Date(), updatedAt:new Date() },
      { name:'Widget B', price: '29.99', description:'Pro widget',   createdAt:new Date(), updatedAt:new Date() }
    ]);
  },
  down: (qi) => qi.bulkDelete('Products', null, {})
};
