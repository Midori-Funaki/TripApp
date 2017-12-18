'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('flights', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flightNumber: {
        type: Sequelize.STRING
      },
      airline: {
        type: Sequelize.STRING
      },
      departureAirport: {
        type: Sequelize.STRING
      },
      departureDate: {
        type: Sequelize.STRING
      },
      departureTime: {
        type: Sequelize.INTEGER
      },
      arrivalAirport: {
        type: Sequelize.STRING
      },
      arrivalDate: {
        type: Sequelize.STRING
      },
      arrivalTime: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('flights');
  }
};