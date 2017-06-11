
// ========================================
// Module for managing athlete accounts
// ========================================


var moment  = require('moment');
var jwt     = require('jwt-simple');
var bcrypt  = require('bcrypt');

var AthleteModel = require('../../models/athlete');
var config = require('../../config');
var errors = require('../../errors/errors');
var Sequelize = require('sequelize');


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



    // *****************************************************************************************************************
    // Find athlete_id by Identificator.
    // On success: callback(null, acitivity_id)
    // On failure: callback(err, null)
    // *****************************************************************************************************************
    findAthleteIdByIdentificator : function(identificator, callback) {
        AthleteModel.findOne({
            where: {Identificator: identificator}
        }).then(function(athlete) {
            if (!athlete) {
                return callback(new Error(errors.USER_NOT_FOUND, null));
            } else {
                return callback(null, athlete.Id);
            }
        }).catch(function(error) {
            return callback(error, null);
        });
    },


    getProfileByIdentificator : function (identificator, callback) {
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
    },


    getProfileByID : function (athlete_id, callback) {
        if (!athlete_id) {
            return callback(new Error(errors.IDENTIFICATOR_IS_ABSENT),null);
        }
        AthleteModel.findOne({
            where: { Id: athlete_id }
        }).then(function (athlete) {
            if (!athlete) {
                return callback(new Error(errors.IDENTIFICATOR_IS_BUSY),null);
            } else {
                return callback(null, athlete);
            }
        });
    },


    searchAthletes : function (searchString, finder_id, callback) {
        if (!searchString) {
            return Error(errors.SEARCH_STRING_IS_ABSENT, null)
        }

        var splitResult = searchString.split("+");
        var stringsArray = [];
        for (i = 0; i < splitResult.length; i++) {
            if(!splitResult[i] == "") {
                stringsArray.push(splitResult[i]);
            }
        }


        AthleteModel.findAll({
            where: Sequelize.literal('athlete.Id <> '+finder_id),
            attributes: ['Id', 'Name', 'Surname']
        }).then(function (athletes) {

            var rightAthletes = [];
            for(i = 0; i < athletes.length; i++) {
                for(j = 0; j < stringsArray.length; j++) {
                    if(athletes[i].Name.toLowerCase().indexOf(stringsArray[j].toLowerCase()) !== -1) {
                        rightAthletes.push({
                            id: athletes[i].Id,
                            name: athletes[i].Name,
                            surname: athletes[i].Surname
                        });
                        break;
                    } else if (athletes[i].Surname.toLowerCase().indexOf(stringsArray[j].toLowerCase()) !== -1) {
                        rightAthletes.push({
                            id: athletes[i].Id,
                            name: athletes[i].Name,
                            surname: athletes[i].Surname
                        });
                        break;
                    }
                }
            }

            return callback(null, rightAthletes);

        }).catch(function (error) {
            return callback(error, null);
        });

    }


};

module.exports = athleteManager;
