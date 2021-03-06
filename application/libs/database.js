
// ========================================
// Module for managing the Database
// ========================================

var fs          = require('fs');

var sequelize   = require('./sequelize');
var logger      = require('./logger')(module);
var config      = require('../config');

// Models of the Database
var CityModel       = require('./../models/city');
var CountryModel    = require('./../models/country');
var CountryLangModel= require('./../models/country_language') ;
var AthleteModel    = require('./../models/athlete');
var ActivityModel   = require('./../models/activity');
var CommentModel    = require('./../models/comment');
var ValueModel      = require('./../models/value');
var SubscriptionModel=require('./../models/subscription');


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

        AthleteModel.hasMany(CommentModel, {foreignKey: 'Athlete_id'});
        CommentModel.belongsTo(AthleteModel, {foreignKey: 'Athlete_id'});

        AthleteModel.hasMany(ValueModel, {foreignKey: 'Athlete_id' });
        ValueModel.belongsTo(AthleteModel, {foreignKey: 'Athlete_id' });

        AthleteModel.hasMany(ActivityModel, {foreignKey: 'Athlete_id' });
        ActivityModel.belongsTo(AthleteModel, {foreignKey: 'Athlete_id' });

        AthleteModel.hasMany(SubscriptionModel, {foreignKey: 'Athlete_id' });
        SubscriptionModel.belongsTo(AthleteModel, {foreignKey: 'Athlete_id' });
        AthleteModel.hasMany(SubscriptionModel, {foreignKey: 'Subscriber_id' });
        SubscriptionModel.belongsTo(AthleteModel, {foreignKey: 'Subscriber_id' });


        CityModel.sync().then(function () {
            logger.info('CITIES\t\tTABLE SYNCHRONIZED');
        });
        CountryModel.sync().then(function () {
            logger.info('COUNTRIES\tTABLE SYNCHRONIZED');
        });
        CountryLangModel.sync().then(function () {
            logger.info('LANGUAGES\tTABLE SYNCHRONIZED');
        });

        AthleteModel.sync().then(function () {
            logger.info('ATHLETE\t\tTABLE SYNCHRONIZED');
        });
        ActivityModel.sync().then(function () {
            logger.info('ACTIVITY\t\tTABLE SYNCHRONIZED');
        });
        CommentModel.sync().then(function () {
            logger.info('COMMENT\t\tTABLE SYNCHRONIZED');
        });
        ValueModel.sync().then(function () {
            logger.info('VALUE\t\tTABLE SYNCHRONIZED');
        });
        SubscriptionModel.sync().then(function () {
           logger.info('SUBSCRIPTION\tTABLE SYNCHRONIZED');
        });


    }



    // *****************************************************************************************************************
    // Upload Country and City tables to the database.
    // *****************************************************************************************************************
    // TODO: organaze SQL script upload
    /*uploadWorld : function () {

        var fd = fs.openSync(__dirname + '/../data/world.sql', 'r');
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
    }*/

};

module.exports = manager;

