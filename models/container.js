'use strict';
module.exports = (sequelize, DataTypes) => {
  var container = sequelize.define('container', {
    hotel: DataTypes.STRING,
    transportation: DataTypes.STRING,
    location: DataTypes.STRING,
    restaurant: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return container;
};