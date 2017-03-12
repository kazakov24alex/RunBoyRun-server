
var Sequelize   = require('sequelize');
var config  = require('./../config');

var sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect
});

module.exports = sequelize;