
// ========================================
// Module for managing the Database
// ========================================


var sequelize = require('./sequelize');
var AthleteModel = require('./../models/athlete');
var logger  = require('./logger')(module);
var log     = require('../logs');


manager = {
    // *****************************************************************************************************************
    // Check the connection to Database
    // *****************************************************************************************************************
    connect : function () {
        sequelize
            .authenticate()
            .then(function (err) {
                logger.info(log.db.CONNECTION_SUCCESS);
                manager.syncTables();
            })
            .catch(function (err) {
                logger.error(log.db.CONNECTION_FAILURE, err.message);
                process.exit(-1);
            });
    },


    // *****************************************************************************************************************
    // Synchronizing tables with the database
    // *****************************************************************************************************************
    syncTables : function () {
        AthleteModel.sync();
    }

};

module.exports = manager;

