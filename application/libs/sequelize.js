
// ========================================
// Sequelize configuration module
// ========================================


var Sequelize = require('sequelize');

var config  = require('./../config');


// Configure the connection to the Database
var sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,
    logging: true
});


module.exports = sequelize;
