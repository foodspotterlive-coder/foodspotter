'use strict';
require('dotenv').config();
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const adminName = process.env.ADMIN_NAME ;
    const adminPassword = process.env.ADMIN_PASSWORD ;
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await queryInterface.bulkInsert('Users', [{
      username: adminName,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    const adminName = process.env.ADMIN_NAME;
    await queryInterface.bulkDelete('Users', { username: adminName }, {});
  }
};
