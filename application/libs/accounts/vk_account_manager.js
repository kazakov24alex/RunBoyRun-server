
// =========================================
// Module for managing VK account of athlete
// =========================================


var athleteManager = require('./athlete_manager');
var config = require('../../config');
var errors = require('../../errors/errors');


VKAccountManager = {

    // *****************************************************************************************************************
    // Initiates the creation of an account associated with the VK account
    // On success: callback(null, token)
    // On failure: callback(error, null)
    // *****************************************************************************************************************
    createVkUser: function (body, role, callback) {
        // check  VK user token correctness
        VKAccountManager.checkTokenVkUser(body.password, function (err, usedId) {
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
    // Login user associated with the VK account
    // On success: callback(null, token)
    // On failure: callback(error, null)
    // *****************************************************************************************************************
    loginVkUser : function(body, callback) {
        // check  VK user token correctness
        VKAccountManager.checkTokenVkUser(body.password, function (err, userId) {
            if (err) {
                return callback(err, null);
            }
            // check VK ID coincidence
            if (userId == body.identificator) {
                // ckeck existance of athlete with this VK ID
                athleteManager.checkIdentificator(config.vk.prefix+body.identificator, function (err) {
                   if(err) {
                       return callback(err, null);
                   } else {
                       // get token
                       athleteManager.getToken(body.identificator, function (token) {
                           return callback(null, token);
                       });
                   }
                });
            } else {
                return callback(new Error(errors.VK_INCORRECT_ACCESS_TOKEN), null);
            }
        });
    },


    // *****************************************************************************************************************
    // Checking correctness of USER_VK_TOKEN.
    // On success: callback(null, user_vk_id)
    // On failure: callback(error, null)
    // *****************************************************************************************************************
    checkTokenVkUser: function (userAccessToken, callback) {
        var rp = require('request-promise');
        var appAccessToken = null;

        // formalize request to getting APP_TOKEN
        var getAppTokenRequest = {
            method: 'GET',
            uri: "https://api.vk.com/oauth/access_token?v=5.21&client_id=" + config.vk.appId + "&client_secret="
            + config.vk.appSecret + "&grant_type=client_credentials",
            json: true // Automatically stringifies the body to JSON
        };

        // starting request to getting APP_TOKEN
        rp(getAppTokenRequest)
            .then(function (parsedBody) {
                if (parsedBody.access_token != null) {
                    appAccessToken = parsedBody.access_token;

                    // formalize request to getting VK_USER_TOKEN
                    var checkUserTokenRequest = {
                        method: 'GET',
                        uri: "https://api.vk.com/method/secure.checkToken?v=5.21&token=" + userAccessToken
                        + "&client_secret=" + config.vk.appSecret + "&access_token=" + appAccessToken,
                        json: true // Automatically stringifies the body to JSON
                    };

                    // starting request to getting VK_USER_TOKEN
                    rp(checkUserTokenRequest)
                        .then(function (parsedBody) {
                            console.log(parsedBody.response);
                            if(parsedBody.response == null) {
                                return callback(new Error(errors.VK_USER_ACCESSTOKEN_IS_INCORRECT), null);
                            }
                            if (parsedBody.response.success == "1") {
                                return callback(null, parsedBody.response.user_id);
                            } else {
                                return callback(new Error(errors.VK_USER_ACCESSTOKEN_IS_INCORRECT), null);
                            }
                        })
                        .catch(function (err) {
                            return callback(err);
                        });
                } else {
                    return callback(new Error(errors.VK_APP_ACCESSTOKEN_NOT_GOT), null);
                }
            })
            .catch(function (err) {
                return callback(err);
            });

    }

};


module.exports = VKAccountManager;
