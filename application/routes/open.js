
// ========================================
// Router for open endpoints
// ========================================


var express = require('express');
var router = express.Router();

var athleteManager = require('../libs/athlete_manager');
var countryManager = require('../libs/country_manager');

var logger = require('../libs/logger')(module);
var config = require('../config');
var errors = require('../errors/errors');
var auth   = require('../libs/auth');


// Registration of new Athlete
router.post('/signup', function (req, res) {
    athleteManager.createUser(req.body, config.role.user, function (err) {
        if(err) {
            res.json({success: false, error: err.message}).end();
            logger.warn('Creating athlete '+req.body.name+' '+req.body.surname+' error: '+err.message);
        }  else {
            athleteManager.requestToken(req.body.identificator, req.body.password, function(err, athlete) {
                if(err) {
                    res.json({success: false, error: err.message}).end();
                    logger.warn('Requesting token error (create athlete): '+err.message);
                } else {
                    res.json({success: true, token: athlete.token}).end();
                    logger.info('Created new athlete: '+req.body.name+' '+req.body.surname);
                }
            });
        }
    })
});


// Login of Athlete
router.post('/signin', function (req, res) {
   athleteManager.requestToken(req.body.identificator, req.body.password, function(err, athlete) {
       if(err) {
           res.json({success: false, error: err.message}).end();
           logger.warn('Login athlete '+req.body.identificator+' error: '+err.message);
       } else {
           res.json({success: true, token: athlete.token}).end();
           logger.info('Login athlete: '+athlete.name+' '+athlete.surname);
       }
   })
});


// Check identificator
router.post('/check', function (req, res) {
    athleteManager.checkIdentificator(req.body.identificator, function(err) {
       if(err) {
           res.json({success: false, error: err.message}).end();
           logger.warn('Identificator '+req.body.identificator+' checking error: '+err.message);
       } else {
           res.json({success: true, busy: true}).end();
           logger.info('Identificator '+req.body.identificator+' checking successfully');
       }
    });
});


// Get counties list
router.get('/countries', function (req, res) {
    countryManager.getCountries(function(err, countries) {
        if(err) {
            res.json({success: false, error: errors.COUNTRY_GET_ERROR}).end();
            logger.warn(errors.COUNTRY_GET_ERROR + ": " + err.message);
        } else {
            res.json({success: true, countries: countries}).end();
            logger.info('Request a list of countries that passed successfully');
        }
    })
});


// Get cities list
router.get('/cities/:countryCode', function (req, res) {
    countryManager.getCities(req.params.countryCode, function(err, cities) {
        if(err) {
            res.json({success: false, error: errors.CITY_GET_ERROR}).end();
            logger.warn(errors.CITY_GET_ERROR + ": " + err.message);
        } else {
            res.json({success: true, cities: cities}).end();
            logger.info('Request a list of cities that passed successfully');
        }
    })
});

// TODO: TEMPORARILY
// Autharization of new User
router.get('/admin_test', auth().authenticate(), function (req, res) {
    if(req.user.role == 'admin') {
        res.json({success: true, message: 'You are ADMIN. Access allowed.', user: req.user}).end();
    } else {
        res.json({success: false, message: 'You are USER. Access denied.', user: req.user}).end();
    }
});


module.exports = router;
