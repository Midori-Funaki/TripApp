'use strict';
module.exports = (sequelize, DataTypes) => {
  var trip = sequelize.define('trips', {
    nightsOfStay: DataTypes.INTEGER,
    startDate: DataTypes.STRING,
    endDate: DataTypes.STRING,
    noOfAdults: DataTypes.INTEGER,
    noOfKids: DataTypes.INTEGER,
    tripName: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  })
  trip.associate = function(models) {
        // associations can be defined here
        
  }
  return trip;
};