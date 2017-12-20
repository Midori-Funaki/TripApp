'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('trips', [{
      nightsOfStay: 2,
      startDate: "2016-08-09",
      endDate: "2016-08-10",
      noOfAdults: 2,
      noOfKids: 1,
      createdAt: "2016-08-09 07:42:28",
      updatedAt: "2016-08-09 07:42:28",
      }], {});    
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('trips', null, {});
  }
};
