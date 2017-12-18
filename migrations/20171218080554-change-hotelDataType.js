'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'hotels',
      'dateOfStay'
    ),
    queryInterface.addColumn(
      'hotels',
      'checkInDate',
      Sequelize.STRING
    ),
    queryInterface.addColumn(
      'hotels',
      'checkOutDate',
      Sequelize.STRING
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'hotels',
      'dateOfStay',
      Sequelize.DATEONLY
    ),
    queryInterface.removeColumn(
      'hotels',
      'checkInDate'
    ),
    queryInterface.removeColumn(
      'hotels',
      'checkOutDate'
    )
  }
};
