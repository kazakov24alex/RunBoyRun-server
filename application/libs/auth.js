

// ========================================
// Module for user authentication
// ========================================

var passport = require('passport');
var passportJwt = require('passport-jwt');
var config = require('../config');
var logger = require('./logger');
var AthleteModel = require('../models/athlete');


// Strategy and token extractors
var ExtractJwt = passportJwt.ExtractJwt;
var Strategy = passportJwt.Strategy;


// Strategy params
var params = {
    secretOrKey: config.token.secret, // Secret
    jwtFromRequest: ExtractJwt.fromAuthHeader() // Token extractor
};



module.exports = function() {
    return {
        // Initialize passport. Called only once
        initialize: function () {
            var strategy = new Strategy(params, function (payload, done) {
                if(payload.exp <= Date.now()) {
                    return done(new Error("Token expired"), null);
                }


                AthleteModel.findOne({
                    where: {id: payload.id}
                }).then(function(athlete) {
                    if(!athlete) {
                        return done(new Error("User not found", null));
                    }

                    done(null, athlete);
                });
            });

            passport.use(strategy);

            return passport.initialize();
        },


        // Authenticate user. Used on route to restrict access to it.
        authenticate: function () {
            return passport.authenticate("jwt", config.token.options);
        }
    }
};
