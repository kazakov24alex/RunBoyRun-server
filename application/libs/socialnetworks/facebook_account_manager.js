
// ===============================================
// Module for managing Facebook account of athlete
// ===============================================


var athleteManager = require('./../managers/athlete_manager');
var config = require('../../config');
var errors = require('../../errors/errors');


facebookAccountManager = {

    // *****************************************************************************************************************
    // Initiates the creation of an account associated with the Facebook account
    // On success: callback(null, token)
    // On failure: callback(error, null)
    // *****************************************************************************************************************
    createFacebookUser: function (body, role, callback) {
        // check Facebook user token correctness
        facebookAccountManager.checkTokenFacebookUser(body.password, function (err, usedId) {
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
    // Login user associated with the Facebook account
    // On success: callback(null, token)
    // On failure: callback(error, null)
    // *****************************************************************************************************************
    loginFacebookUser : function(body, callback) {
        // check Facebook user token correctness
        facebookAccountManager.checkTokenFacebookUser(body.password, function (err, userId) {
            if (err) {
                return callback(err, null);
            }
            // check Facebook ID coincidence
            if (userId == body.identificator) {
                // ckeck existance of athlete with this Facebook ID
                athleteManager.checkIdentificator(body.identificator, function (err) {
                    if(err) {
                        return callback(new Error(errors.FACEBOOK_USER_NOT_REGISTRED), null);
                    } else {
                        // get token
                        athleteManager.getToken(body.identificator, function (token) {
                            return callback(null, token);
                        });
                    }
                });
            } else {
                return callback(new Error(errors.FACEBOOK_USER_ACCESSTOKEN_IS_INCORRECT), null);
            }
        });
    },


    // *****************************************************************************************************************
    // Checking correctness of USER_FACEBOOK_TOKEN.
    // On success: callback(null, user_facebook_id)
    // On failure: callback(error, null)
    // *****************************************************************************************************************
    checkTokenFacebookUser: function (userAccessToken, callback) {
        var rp = require('request-promise');

        // formalize request to getting APP_TOKEN
        var getAppTokenRequest = {
            method: 'GET',
            uri: "https://graph.facebook.com/me?access_token="+userAccessToken,
            json: true // Automatically stringifies the body to JSON
        };

        // starting request to getting APP_TOKEN
        rp(getAppTokenRequest)
            .then(function (parsedBody) {
                if (parsedBody.id != null) {
                    return callback(null, parsedBody.id);
                } else {
                    return callback(new Error(errors.FACEBOOK_USER_ACCESSTOKEN_IS_INCORRECT), null);
                }
            })
            .catch(function (err) {
                return callback(new Error(errors.FACEBOOK_USER_ACCESSTOKEN_IS_INCORRECT), null);
            });
    }

};


module.exports = facebookAccountManager;
