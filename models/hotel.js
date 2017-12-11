'use strict';
module.exports = (sequelize, DataTypes) => {
  var hotel = sequelize.define('hotel', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    nightsOfStay: DataTypes.INTEGER,
    dateOfStay: DataTypes.DATEONLY
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return hotel;
};