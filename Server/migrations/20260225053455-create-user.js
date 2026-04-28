'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Restaurant', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      place: {
        type: Sequelize.STRING
      },
      landmark: {
        type: Sequelize.STRING
      },
      famousRecipe: {
        type: Sequelize.STRING
      },
      averagePrice: {
        type: Sequelize.FLOAT
      },
      operatingDays: {
        type: Sequelize.STRING
      },
      operatingHours: {
        type: Sequelize.JSON
      },
      paymentTypes: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      time:{
        type:Sequelize.TIME
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Restaurant');
  }
};