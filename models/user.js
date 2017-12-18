'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('users', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING

  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        user.belongsToMany(Trip,{through:'user_trips',foreignKey:'trip_id',otherKey:'user_id'});
      }
    }
  });
  return user;
};