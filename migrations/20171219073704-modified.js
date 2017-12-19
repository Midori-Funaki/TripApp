'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.renameColumn(
      'users',
      'firstName',
      'username'
    ).then(()=> {
      queryInterface.renameColumn(
      'users',
      'lastName',
      'facebookId'
      );
    });
  },
  // The down function should do exactly oppsoite to reverse what is done on the up function
  down: function(queryInterface, Sequelize) {
    return queryInterface.renameColumn(
      'users',
      'username',
      'firstName'
    ).then(()=> {
      queryInterface.renameColumn(
        'users',
        'facebookId',
        'lastName'
      );
    });
  }
};