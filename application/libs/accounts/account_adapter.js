
// ========================================
// Module for managing athlete accounts
// ========================================


var athleteManager = require('./athlete_manager');
var vkAccountManager = require('./vk_account_manager');

var config = require('../../config');
var errors = require('../../errors/errors');


accountAdapter = {
    // callback(err, token)
    adapterCreateUser : function (body, role, callback) {
        if(body.oauth == "own") {
            athleteManager.createUser(body, role, function (err) {
                if(err) {
                    return callback(err, null);
                } else {
                    athleteManager.getToken(body.identificator, function (token) {
                        return callback(null, token);
                    });
                }
            });

        } else if(body.oauth == "vk") {
            body.identificator = "vk.com/id"+body.identificator;
            vkAccountManager.createVkUser(body, role, function(err, token) {
                if(err) {
                    return callback(err, null);
                } else {
                    return callback(null, token)
                }
            });

        } else if(body.oauth == "google") {

        } else if(body.oauth == "facebook") {

        } else {
            return callback(new Error(errors.OAUTH_NOT_DEFINED), null);
        }
    }

};

module.exports = accountAdapter;
