'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'trips',
      'user_id',
     Sequelize.INTEGER
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'trips',
      'user_id'
    );
  }
};
