'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      username: 'John',
      email: 'demo@demo.com',
      password: 'password',
      facebookId: 'facebookId',
      createdAt: "2016-08-09 07:42:28",
      updatedAt: "2016-08-09 07:42:28",
      }], {});    
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('users', null, {});
  }
};
