'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('transactions', [{
      trip_id: 1,
      date: "2016-08-09",
      order: 1,
      activity: '{"type":"location","name":"naked hub sheung wan","address":"7F,＃40-44 Bonham Strand, Sheung Wan"}',
      createdAt: "2016-08-09 07:42:28",
      updatedAt: "2016-08-09 07:42:28",
      }], {});    
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('transactions', null, {});
  }
};
