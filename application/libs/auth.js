
// ========================================
// Module for user authentication
// ========================================


var passport    = require('passport');
var passportJwt = require('passport-jwt');

var config = require('../config');
var err    = require('../errors/errors');
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
                    return done(err.USER_NOT_FOUND, null);
                }


                AthleteModel.findOne({
                    where: {Identificator: payload.identificator}
                }).then(function(athlete) {
                    if(!athlete) {
                        return done(err.USER_NOT_FOUND, null);
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
