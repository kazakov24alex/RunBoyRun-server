
// =============================================
// Module for managing Google account of athlete
// =============================================


var athleteManager = require('./../managers/athlete_manager');
var config = require('../../config');
var errors = require('../../errors/errors');


googleAccountManager = {

    // *****************************************************************************************************************
    // Initiates the creation of an account associated with the Google account
    // On success: callback(null, token)
    // On failure: callback(error, null)
    // *****************************************************************************************************************
    createGoogleUser: function (body, role, callback) {
        // check Google user token correctness
        googleAccountManager.checkTokenGoogleUser(body.password, function (err, usedId) {
            if (err) {
                return callback(err, null);
            } else {
                // record user to database
                athleteManager.createUser(body, role, function (err) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        // get token
                        athleteManager.getToken(body.identificator, function (token) {
                            return callback(null, token);
                        })
                    }
                });
            }

        });
    },


    // *****************************************************************************************************************
    // Login user associated with the Google account
    // On success: callback(null, token)
    // On failure: callback(error, null)
    // *****************************************************************************************************************
    loginGoogleUser : function(body, callback) {
        // check Google user token correctness
        googleAccountManager.checkTokenGoogleUser(body.password, function (err, userId) {
            if (err) {
                return callback(err, null);
            }
            // check Google ID coincidence
            if (userId == body.identificator) {
                // ckeck existance of athlete with this Google ID
                athleteManager.checkIdentificator(config.google.prefix+body.identificator, function (err) {
                    if(err) {
                        return callback(new Error(errors.GOOGLE_USER_NOT_REGISTRED), null);
                    } else {
                        // get token
                        athleteManager.getToken(body.identificator, function (token) {
                            return callback(null, token);
                        });
                    }
                });
            } else {
                return callback(new Error(errors.GOOGLE_INCORRECT_ACCESS_TOKEN), null);
            }
        });
    },


    // *****************************************************************************************************************
    // Checking correctness of USER_GOOGLE_TOKEN.
    // On success: callback(null, user_google_id)
    // On failure: callback(error, null)
    // *****************************************************************************************************************
    checkTokenGoogleUser: function (userAccessToken, callback) {
        var rp = require('request-promise');

        // formalize request to getting APP_TOKEN
        var getAppTokenRequest = {
            method: 'GET',
            uri: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token="+userAccessToken,
            json: true // Automatically stringifies the body to JSON
        };

        // starting request to getting APP_TOKEN
        rp(getAppTokenRequest)
            .then(function (parsedBody) {
                if (parsedBody.id != null) {
                    return callback(null, parsedBody.id);
                } else {
                    return callback(new Error(errors.GOOGLE_USER_ACCESSTOKEN_IS_INCORRECT), null);
                }
            })
            .catch(function (err) {
                return callback(new Error(errors.GOOGLE_USER_ACCESSTOKEN_IS_INCORRECT), null);
            });

    }

};


module.exports = googleAccountManager;
