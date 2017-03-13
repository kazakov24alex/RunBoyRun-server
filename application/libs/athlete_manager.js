
// ========================================
// Module for managing athlete accounts
// ========================================


var moment  = require('moment');
var jwt     = require('jwt-simple');
var bcrypt  = require('bcrypt');

var AthleteModel = require('../models/athlete');
var config = require('../config');
var errors = require('../errors/errors');


module.exports = {
    // *****************************************************************************************************************
    // Create new user.
    // On success: callback(null)
    // On failure: callback(error)
    // *****************************************************************************************************************
    createUser : function (body, role, callback) {

        // Store hash in your password DB.
        bcrypt.hash(body.password, config.hash.saltRound, function(err, hashed_password) {
            if (err){
                return callback(err);
            }

            // Create a record of 'Athlete' table
            AthleteModel.create({
                name:           body.name,
                surname:        body.surname,
                identificator:  body.identificator,
                hashed_password:hashed_password,
                role:           role,
                birthday:       body.birthday,
                country:        body.country,
                city:           body.city
            }).then(function(result) {
                if (!result[1]) {
                    return callback(null);
                }
            }).catch(function(error) {
                return callback(error);
            });

        });
    },


    // *****************************************************************************************************************
    // Request token by identificator and password. On success attaches field token to athlete object.
    // On success: callback(null, athlete)
    // On failure: callback(error, null)
    // *****************************************************************************************************************
    requestToken  : function (identificator, password, callback) {
        // Check availability of identificator and password
        if(!identificator) {
            return callback(errors.IDENTIFICATOR_IS_ABSENT, null);
        } else if(!password) {
            return callback(errors.PASSWORD_IS_ABSENT, null);
        }

        // Find the athlete by identificator
        AthleteModel.findOne({
            where: {identificator: identificator}
        }).then(function(athlete) {
            if(!athlete) {
                return callback(errors.USER_NOT_FOUND, null);
            }

            // Password comparison
            bcrypt.compare(password, athlete.hashed_password, function(err, res) {
                if(err) {
                    return callback(err);
                }else if(!res) {
                    return callback(errors.PASSWORD_IS_INCORRECT, null);
                }

                // Make and attach token
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
