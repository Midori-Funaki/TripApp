'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'containers',
      'hotel'
    ),
    queryInterface.removeColumn(
      'containers',
      'transportation'
    ),
    queryInterface.removeColumn(
      'containers',
      'location'
    ),
    queryInterface.removeColumn(
      'containers',
      'restaurant'
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'containers',
      'hotel',
      Sequelize.STRING
    ),
    queryInterface.addColumn(
      'containers',
      'transportation',
      Sequelize.STRING
    ),
    queryInterface.addColumn(
      'containers',
      'location',
      Sequelize.STRING
    ),
    queryInterface.addColumn(
      'containers',
      'restaurant',
      Sequelize.STRING
    )
  }
};
