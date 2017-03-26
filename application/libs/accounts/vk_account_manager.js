
// =========================================
// Module for managing VK account of athlete
// =========================================


var athleteManager = require('./athlete_manager');
var config = require('../../config');
var errors = require('../../errors/errors');


VKAccountManager = {

// callback(err, token)
    createVkUser: function (body, role, callback) {
        VKAccountManager.checkTokenVkUser(body.password, function (err) {
            if (err) {
                return callback(err, null);
            } else {
                athleteManager.createUser(body, role, function (err) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        athleteManager.getToken(body.identificator, function (token) {
                            return callback(null, token);
                        })
                    }
                });
            }

        });
    },


    checkTokenVkUser: function (userAccessToken, callback) {
        var rp = require('request-promise');
        var appAccessToken = null;

        var getAppTokenRequest = {
            method: 'GET',
            uri: "https://api.vk.com/oauth/access_token?v=5.21&client_id=" + config.vk.appId + "&client_secret="
            + config.vk.appSecret + "&grant_type=client_credentials",
            json: true // Automatically stringifies the body to JSON
        };


        rp(getAppTokenRequest)
            .then(function (parsedBody) {
                if (parsedBody.access_token != null) {
                    appAccessToken = parsedBody.access_token;

                    var checkUserTokenRequest = {
                        method: 'GET',
                        uri: "https://api.vk.com/method/secure.checkToken?v=5.21&token=" + userAccessToken
                        + "&client_secret=" + config.vk.appSecret + "&access_token=" + appAccessToken,
                        json: true // Automatically stringifies the body to JSON
                    };

                    rp(checkUserTokenRequest)
                        .then(function (parsedBody) {
                            if (parsedBody.response.success == "1") {
                                return callback(null);
                            } else {
                                return callback(new Error(errors.VK_USER_ACCESSTOKEN_IS_EXPIRED));
                            }
                        })
                        .catch(function (err) {
                            return callback(err);
                        });
                } else {
                    return callback(new Error(errors.VK_APP_ACCESSTOKEN_NOT_GOT));
                }
            })
            .catch(function (err) {
                return callback(err);
            });

    }

};


module.exports = VKAccountManager;
