
// ========================================
// Module for managing user accounts
// ========================================

var moment  = require('moment');
var jwt     = require('jwt-simple');
var bcrypt  = require('bcrypt');

var AthleteModel = require('../models/athlete');
var logger = require('./logger')(module);
var config = require('../config');
var errors = require('../errors/errors');


module.exports = {
    // *****************************************************************************************************************
    // Create new user.
    // *****************************************************************************************************************
    createUser : function (body, role, callback) {
        if(!body.name) {
            return(callback(errors.name.ERROR_INVALID_NAME));
        } if(!body.surname) {
            return(callback(new Error('Surname not defined')));
        } if(!body.identificator) {
            return(callback(new Error('Identificator not defined')));
        } if(!body.password) {
            return(callback(new Error('Password not defined')));
        } if(!body.birthday) {
            return(callback(new Error('Birthday not defined')));
        } if(!body.country) {
            return(callback(new Error('Country not defined')));
        } if(!body.city) {
            return(callback(new Error('City not defined')));
        } if(role!='user' && role!='admin') {
            return(callback(new Error('Incorrect role')))
        }


        // Store hash in your password DB.
        bcrypt.hash(body.password, config.hash.saltRound, function(err, hashed_password) {
            if (err){
                return callback(err);
            }

            AthleteModel.create({
                name: body.name,
                surname: body.surname,
                identificator: body.identificator,
                hashed_password: hashed_password,
                role: role,
                birthday: body.birthday,
                country: body.country,
                city: body.city
            }).then(function(result) {
                if (!result[1]) {
                    console.log('GOOD!');
                    return callback(null);
                }

            }).catch(function(error) {
                logger.error('BLAT. '+error.message);
                return callback(err);
            });

        });
    },


    // *****************************************************************************************************************
    // Request token by username and password. On success attaches field token to user object
    // *****************************************************************************************************************
    requestToken  : function (identificator, password, callback) {
        if(!identificator) {
            return callback(new Error('Login not defined'), null);
        }
        if(!password) {
            return callback(new Error('Password not defined'), null);
        }

        AthleteModel.findOne({
            where: {identificator: identificator}
        }).then(function(athlete) {
            if(!athlete) {
                return callback(new Error('User ' + login + ' not found'), null);
            }
            // password comparison
            bcrypt.compare(password, athlete.hashed_password, function(err, res) {
                if(err) {
                    return callback(err);
                }
                if(!res) {
                    return callback(new Error('Incorrect password'), null);
                }

                var expires = moment().add(config.token.life.amount, config.token.life.unit).valueOf();

                athlete.token = jwt.encode({
                    id: athlete.id,
                    exp: expires
                }, config.token.secret);

                callback(null, athlete);
            });
        });
    }

};