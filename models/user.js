'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('users', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    facebookId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    }
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