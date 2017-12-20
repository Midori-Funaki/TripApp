'use strict';
module.exports = (sequelize, DataTypes) => {
  var transactions = sequelize.define('transactions', {
    trip_id: DataTypes.INTEGER,
    date: DataTypes.STRING,
    order: DataTypes.INTEGER,
    activity: DataTypes.JSONB
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return transactions;
};