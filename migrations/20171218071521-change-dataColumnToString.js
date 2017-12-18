'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.changeColumn(
      'trips',
      'startDate',
      Sequelize.STRING
    ),
    queryInterface.changeColumn(
      'trips',
      'endDate',
      Sequelize.STRING
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.changeColumn(
      'trips',
      'startDate',
      Sequelize.DATEONLY
    ),
    queryInterface.changeColumn(
      'trips',
      'endDate',
      Sequelize.DATEONLY
    )
  }
};
