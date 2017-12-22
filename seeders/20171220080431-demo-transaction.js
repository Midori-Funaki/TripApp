'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('transactions', [{
      trip_id: 1,
      date: "2017-12-22",
      order: 1,
      activity: '{"type":"Location","request_date":"2017-12-22","lat":"-34.4233","lng":"150.896","map_result":{"name":"naked hub sheung wan","address":"7F,＃40-44 Bonham Strand, Sheung Wan"}}',
      createdAt: "2016-08-09 07:42:28",
      updatedAt: "2016-08-09 07:42:28",
      }], {});    
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('transactions', null, {});
  }
};
