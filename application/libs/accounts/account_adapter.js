
// ========================================
// Module for managing athlete accounts
// ========================================


var athleteManager = require('./athlete_manager');
var vkAccountManager = require('./vk_account_manager');

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
                // TODO: GOOGLE REGISTRATION
                break;

            case config.facebook.name:
                // TODO: FACEBOOK REGISTRATION
                break;

            default:
                return callback(new Error(errors.OAUTH_NOT_DEFINED), null);
                break;
        }

    },


    // *****************************************************************************************************************
    // Distributes login requests for certain types (own, VK, Google, Facebook).
    // On success: callback(null, token)
    // On failure: callback(error, null)
    // *****************************************************************************************************************
    adapterLoginUser : function (body, callback) {

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
                // TODO: GOOGLE LOGIN
                break;

            case config.facebook.name:
                // TODO: FACEBOOK LOGIN
                break;

            default:
                return callback(new Error(errors.OAUTH_NOT_DEFINED), null);
                break;
        }

    }

};

module.exports = accountAdapter;
