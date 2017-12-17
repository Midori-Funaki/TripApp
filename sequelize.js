const Sequelize = require('sequelize');

const connection = 'postgres://tripuser:trippassword@localhost:5432/tripdb';
const sequelize = new Sequelize(connection);

module.exports = sequelize;