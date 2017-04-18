
// ========================================
// Module for managing athlete socialnetworks
// ========================================


var athleteManager = require('./athlete_manager');
var vkAccountManager = require('./../socialnetworks/vk_account_manager');
var googleAccountManager = require('./../socialnetworks/google_account_manager');
var facebookAccountManager = require('./../socialnetworks/facebook_account_manager');

var config = require('../../config');
var errors = require('../../errors/errors');


accountAdapter = {

    // *****************************************************************************************************************
    // Distributes registration requests for certain types (own, VK, Google, Facebook).
    // On success: callback(null, token)
    // On failure: callback(error, null)
    // *****************************************************************************************************************
    adapterCreateUser : function (body, role, callback) {

        switch(body.oauth) {
            case "own":
                athleteManager.createUser(body, role, function (err) {
                    if(err) {
                        return callback(err, null);
                    } else {
                        athleteManager.getToken(body.identificator, function (token) {
                            return callback(null, token);
                        });
                    }
                });
                break;

            case config.vk.name:
                body.identificator = config.vk.prefix + body.identificator;
                vkAccountManager.createVkUser(body, role, function(err, token) {
                    if(err) {
                        return callback(err, null);
                    } else {
                        return callback(null, token)
                    }
                });
                break;

            case config.google.name:
                body.identificator = config.google.prefix + body.identificator;
                googleAccountManager.createGoogleUser(body, role, function(err, token) {
                    if(err) {
                        return callback(err, null);
                    } else {
                        return callback(null, token)
                    }
                });
                break;

            case config.facebook.name:
                body.identificator = config.facebook.prefix + body.identificator;
                facebookAccountManager.createFacebookUser(body, role, function(err, token) {
                    if(err) {
                        return callback(err, null);
                    } else {
                        return callback(null, token)
                    }
                });
                break;

            default:
                return callback(new Error(errors.OAUTH_INCORRECT), null);
                break;
        }

    },


    // *****************************************************************************************************************
    // Distributes login requests for certain types (own, VK, Google, Facebook).
    // On success: callback(null, token)
    // On failure: callback(error, null)
    // *****************************************************************************************************************
    adapterLoginUser : function (body, callback) {
        console.log("!!!"+body.identificator);
        switch(body.oauth) {
            case "own":
                athleteManager.requestTokenByPassword(body.identificator, body.password, function (err, token) {
                    if(err) {
                        return callback(err, null);
                    } else {
                        athleteManager.getToken(body.identificator, function (token) {
                            return callback(null, token);
                        });
                    }
                });
                break;

            case config.vk.name:

                vkAccountManager.loginVkUser(body, function(err, token) {
                    if(err) {
                        return callback(err, null);
                    } else {
                        return callback(null, token)
                    }
                });
                break;

            case config.google.name:
                googleAccountManager.loginGoogleUser(body, function(err, token) {
                    if(err) {
                        return callback(err, null);
                    } else {
                        return callback(null, token)
                    }
                });
                break;

            case config.facebook.name:
                facebookAccountManager.loginFacebookUser(body, function(err, token) {
                    if(err) {
                        return callback(err, null);
                    } else {
                        return callback(null, token)
                    }
                });
                break;

            default:
                return callback(new Error(errors.OAUTH_INCORRECT), null);
                break;
        }

    },


    // *****************************************************************************************************************
    // Check if the user is already registred.
    // On success: callback(null)
    // On failure: callback(error)
    // *****************************************************************************************************************
    adapterCheckUser : function (body, callback) {

        switch(body.oauth) {
            case "own":
                break;

            case config.vk.name:
                body.identificator = config.vk.prefix+body.identificator;
                break;

            case config.google.name:
                body.identificator = config.google.prefix+body.identificator;
                break;

            case config.facebook.name:
                body.identificator = config.facebook.prefix+body.identificator;
                break;

            default:
                return callback(new Error(errors.OAUTH_INCORRECT));
                break;
        }


        athleteManager.checkIdentificator(body.identificator, function(err) {
            if(err) {
                return callback(err);
            } else {
                return callback(null);
            }
        });

    }

};


module.exports = accountAdapter;
