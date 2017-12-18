'use strict';
module.exports = (sequelize, DataTypes) => {
  var transportation = sequelize.define('transportation', {
    companyName: DataTypes.STRING,
    transportType: DataTypes.STRING,
    price: DataTypes.INTEGER,
    startingLocation: DataTypes.STRING,
    destination: DataTypes.STRING,
    journeyTime: DataTypes.INTEGER,
    departureTime: DataTypes.INTEGER,
    ticketType: DataTypes.STRING,
    container_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return transportation;
};