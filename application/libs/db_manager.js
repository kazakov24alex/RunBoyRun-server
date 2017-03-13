
// ========================================
// Module for managing the Database
// ========================================


var sequelize   = require('./sequelize');
var logger      = require('./logger')(module);

// Models of the Database
var AthleteModel = require('./../models/athlete');


manager = {
    // *****************************************************************************************************************
    // Check the connection to Database
    // *****************************************************************************************************************
    connect : function () {
        sequelize
            .authenticate()
            .then(function () {
                logger.info('CONNETCTION WITH DATABASE HAS BEEN ESTABLISHED SUCCESSFULLY');
                manager.syncTables();
            })
            .catch(function (error) {
                logger.error('CONNECTION TO THE DATABASE IS NOT ESTABLISHED: '+error.message);
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

