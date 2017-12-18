'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'containers',
      'trip_id',
     Sequelize.INTEGER
    ),
    queryInterface.addColumn(
      'hotels',
      'container_id',
     Sequelize.INTEGER
    ),
    queryInterface.addColumn(
      'transportation',
      'container_id',
     Sequelize.INTEGER
    ),
    queryInterface.addColumn(
      'locations',
      'container_id',
     Sequelize.INTEGER
    ),
    queryInterface.addColumn(
      'flights',
      'container_id',
     Sequelize.INTEGER
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'containers',
      'trip_id'
    ),
    queryInterface.removeColumn(
      'hotels',
      'container_id'
    ),
    queryInterface.removeColumn(
      'transportation',
      'container_id'
    ),
    queryInterface.removeColumn(
      'locations',
      'container_id'
    ),
    queryInterface.removeColumn(
      'flights',
      'container_id'
    )
  }
};
