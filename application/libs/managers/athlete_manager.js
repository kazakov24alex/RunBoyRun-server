
// ========================================
// Module for managing athlete accounts
// ========================================


var moment  = require('moment');
var jwt     = require('jwt-simple');
var bcrypt  = require('bcrypt');

var AthleteModel = require('../../models/athlete');
var config = require('../../config');
var errors = require('../../errors/errors');


athleteManager = {

    // *****************************************************************************************************************
    // Get new token by identificator.
    // On success: callback(token)
    // On failure: callback(null)
    // *****************************************************************************************************************
    getToken : function (identificator, callback) {
        // Make and attach token
        var expires = moment().add(config.token.life.amount, config.token.life.unit).valueOf();
        var token = jwt.encode({
            identificator: identificator,
            exp: expires
        }, config.token.secret);
        return callback(token)
    },

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

            // Create a record of 'athlete' table
            AthleteModel.create({
                Name:           body.name,
                Surname:        body.surname,
                Identificator:  body.identificator,
                Hashed_password:hashed_password,
                Role:           role,
                Sex:            body.sex,
                Birthday:       body.birthday,
                Country:        body.country,
                City:           body.city
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
    requestTokenByPassword  : function (identificator, password, callback) {
        // Check availability of identificator and password
        if(!identificator) {
            return callback(new Error(errors.IDENTIFICATOR_IS_ABSENT, null));
        } else if(!password) {
            return callback(new Error(errors.PASSWORD_IS_ABSENT, null));
        }

        // Find the athlete by identificator
        AthleteModel.findOne({
            where: {Identificator: identificator}
        }).then(function(athlete) {
            if(!athlete) {
                return callback(new Error(errors.USER_NOT_FOUND, null));
            }

            // Password comparison
            bcrypt.compare(password, athlete.Hashed_password, function(err, res) {
                if(err) {
                    return callback(err);
                }else if(!res) {
                    return callback(new Error(errors.PASSWORD_IS_INCORRECT, null));
                }

                // TODO: call getToken

                return callback(null, athlete);
            });
        });
    },


    // *****************************************************************************************************************
    // Check the existence of the identifier.
    // On success: callback(null)
    // On failure: callback(err)
    // *****************************************************************************************************************
    checkIdentificator  : function (identificator, callback) {
        if (!identificator) {
            return callback(new Error(errors.IDENTIFICATOR_IS_ABSENT));
        }

        // Find the athlete by identificator
        AthleteModel.findOne({
            where: {Identificator: identificator}
        }).then(function (athlete) {
            if (!athlete) {
                return callback(new Error(errors.IDENTIFICATOR_IS_BUSY));
            } else {
                return callback(null);
            }
        });
    },
    
    getProfileInformation : function (identificator, callback) {
        if (!identificator) {
            return callback(new Error(errors.IDENTIFICATOR_IS_ABSENT),null);
        }
        AthleteModel.findOne({
            where: {Identificator: identificator}
        }).then(function (athlete) {
            if (!athlete) {
                return callback(new Error(errors.IDENTIFICATOR_IS_BUSY),null);
            } else {
                return callback(null, athlete);
            }
        });
    }
        // getinfo по принципу файндвоне
};

module.exports = athleteManager;
