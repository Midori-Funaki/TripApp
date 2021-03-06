'use strict';
module.exports = (sequelize, DataTypes) => {
  var location = sequelize.define('locations', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    longtitude: DataTypes.STRING,
    latitude: DataTypes.STRING,
    container_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return location;
};