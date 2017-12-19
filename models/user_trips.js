'use strict';
module.exports = (sequelize, DataTypes) => {
  var user_trips = sequelize.define('user_trips', {
    trip_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return user_trips;
};