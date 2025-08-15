const bcrypt = require('bcrypt');
module.exports = {
  up: async (qi) => {
    const hash = await bcrypt.hash('Admin123!', 10);
    await qi.bulkInsert('Users', [
      { email: 'admin@example.com', password: hash, role: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { email: 'cust@example.com', password: hash, role: 'customer', createdAt: new Date(), updatedAt: new Date() },
      { email: 'supplier@example.com', password: hash, role: 'supplier', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  down: (qi) => qi.bulkDelete('Users', null, {})
};
