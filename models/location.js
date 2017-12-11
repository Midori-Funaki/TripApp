'use strict';
module.exports = (sequelize, DataTypes) => {
  var location = sequelize.define('location', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    longtitude: DataTypes.STRING,
    latitude: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return location;
};