'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('transportation', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      companyName: {
        type: Sequelize.STRING
      },
      transportType: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      startingLocation: {
        type: Sequelize.STRING
      },
      destination: {
        type: Sequelize.STRING
      },
      journeyTime: {
        type: Sequelize.INTEGER
      },
      departureTime: {
        type: Sequelize.INTEGER
      },
      ticketType: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('transportation');
  }
};