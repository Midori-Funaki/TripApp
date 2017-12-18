'use strict';
module.exports = (sequelize, DataTypes) => {
  var hotel = sequelize.define('hotels', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    nightsOfStay: DataTypes.INTEGER,
    container_id: DataTypes.INTEGER,
    checkInDate: DataTypes.STRING,
    checkOutDate: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return hotel;
};