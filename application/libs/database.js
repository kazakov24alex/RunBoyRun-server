
// ========================================
// Module for managing the Database
// ========================================

var fs          = require('fs');

var sequelize   = require('./sequelize');
var logger      = require('./logger')(module);
var config      = require('../config');

// Models of the Database
var AthleteModel    = require('./../models/athlete');
var CityModel       = require('./../models/city');
var CountryModel    = require('./../models/country');
var CountryLangModel= require('./../models/country_language') ;

manager = {
    // *****************************************************************************************************************
    // Check the connection to Database.
    // *****************************************************************************************************************
    connect : function () {
        sequelize
            .authenticate()
            .then(function () {
                logger.info('CONNETCTION WITH DATABASE HAS BEEN ESTABLISHED SUCCESSFULLY');
                manager.syncTables();
            })
            .catch(function (error) {
                logger.error('CONNECTION TO THE DATABASE IS NOT ESTABLISHED: '+error);
                process.exit(-1);
            });
    },


    // *****************************************************************************************************************
    // Synchronizing tables with the database.
    // *****************************************************************************************************************
    syncTables : function () {
        //manager.uploadWorld();

        CityModel.sync().then(function () {
            logger.info('CITIES TABLE SYNCHRONIZED');
        });
        CountryModel.sync().then(function () {
            logger.info('COUNTRIES TABLE SYNCHRONIZED');
        });
        CountryLangModel.sync().then(function () {
            logger.info('LANGUAGES TABLE SYNCHRONIZED');
        });

        AthleteModel.sync().then(function () {
            logger.info('ATHLETE TABLE SYNCHRONIZED');
        });

    },



    // *****************************************************************************************************************
    // Upload Country and City tables to the database.
    // *****************************************************************************************************************
    // TODO: organaze SQL script upload
    uploadWorld : function () {

       /* var fd = fs.openSync(__dirname + '/../data/world.sql', 'r');
        var decoder = new (require('string_decoder').StringDecoder)();
        var buf = new Buffer(10);
        var list = [], str, bytesReaded;

        while (bytesReaded = fs.readSync(fd, buf, 0, 10, null)) {
            str = (list.pop() || '') + decoder.write(buf.slice(0, bytesReaded));
            list = list.concat(str.split("\n"));
        }

        list.forEach(function(item, i, list) {
            console.log("ITEM = "+item);
            sequelize.query(item, {
                raw: true
            }).then(function () {
                return sequelize.sync({force: true});
            }).then(function () {
                console.log('Database recreated!');
            }, function (err) {
                throw err;
            });
        });



*/


    }

};

module.exports = manager;

