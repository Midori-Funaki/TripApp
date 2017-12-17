'use strict';
module.exports = (sequelize, DataTypes) => {
  var flight = sequelize.define('flights', {
    flightNumber: DataTypes.STRING,
    airline: DataTypes.STRING,
    departureAirport: DataTypes.STRING,
    departureDate: DataTypes.STRING,
    departureTime: DataTypes.INTEGER,
    arrivalAirport: DataTypes.STRING,
    arrivalDate: DataTypes.STRING,
    arrivalTime: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return flights;
};