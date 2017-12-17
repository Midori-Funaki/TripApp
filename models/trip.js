'use strict';
module.exports = (sequelize, DataTypes) => {
  var trip = sequelize.define('trips', {
    nightsOfStay: DataTypes.INTEGER,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    noOfAdults: DataTypes.INTEGER,
    noOfKids: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return trip;
};