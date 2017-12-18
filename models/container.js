'use strict';
module.exports = (sequelize, DataTypes) => {
  var container = sequelize.define('containers', {
    date: DataTypes.STRING,
    trip_id: DataTypes.INTEGER
  })
  container.associate = function(models){
        // associations can be defined here
        container.hasOne(models.hotels,{foreignKey:'container_id'});
        container.hasMany(models.transportation,{foreignKey:'container_id', sourceKey:'id'});
        container.hasMany(models.locations,{foreignKey:'container_id', sourceKey:'id'});
        container.hasMany(models.flights,{foreignKey:'container_id', sourceKey:'id'});
  };
  return container;
};