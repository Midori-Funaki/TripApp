'use strict';
module.exports = (sequelize, DataTypes) => {
  var trip = sequelize.define('trips', {
    nightsOfStay: DataTypes.INTEGER,
    startDate: DataTypes.STRING,
    endDate: DataTypes.STRING,
    noOfAdults: DataTypes.INTEGER,
    noOfKids: DataTypes.INTEGER
  })
  trip.associate = function(models) {
        // associations can be defined here
        trip.belongsToMany(models.users,{through:'user_trips',foreignKey:'user_id',otherKey:'trip_id'})
        trip.hasMany(models.containers,{foreignKey:'trip_id', sourceKey:'id'});
  }
  return trip;
};