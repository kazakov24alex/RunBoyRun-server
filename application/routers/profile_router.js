var express = require('express');
var router = express.Router();

var athleteManager      = require('../libs/managers/athlete_manager');
var subscriptionManager = require('../libs/managers/subscription_manager');


var logger = require('../libs/logger')(module);
var config = require('../config');
var errors = require('../errors/errors');
var auth   = require('../libs/auth');


router.get('/profile', auth().authenticate(), function (req, res) {
    athleteManager.getProfileByIdentificator(req.user.Identificator, function (err, athlete) {
        if (err){
            logger.warn("Getting profile info error: "+err.message);
            res.json({success: false, error: err.message});
        }
        else{
            logger.warn("Athlete '"+req.user.Identificator+"' got profile info (ID="+req.user.Id+")");
            res.json({success: true, id: athlete.Id, name: athlete.Name, surname: athlete.Surname, birthday: athlete.Birthday,
                sex: athlete.Sex, country: athlete.Country, city: athlete.City, subscription: null}).end();
        }
    });
});


router.get('/profile/:athlete_id', auth().authenticate(), function (req, res) {
    athleteManager.getProfileByID(req.params.athlete_id, function (err, athlete) {
        if (err){
            logger.warn("Getting profile info error: "+err.message);
            res.json({success: false, error: err.message});
        }
        else{
            subscriptionManager.checkSubscription(req.user.Id, req.params.athlete_id, function (err, subscription) {
                if (err){
                    logger.warn("Getting profile info error: "+err.message);
                    res.json({success: false, error: err.message});
                } else {
                    logger.warn("Athlete '"+req.user.Identificator+"' got profile info (ID="+req.params.athlete_id+")");
                    res.json({success: true, id: athlete.Id, name: athlete.Name, surname: athlete.Surname, birthday: athlete.Birthday,
                        sex: athlete.Sex, country: athlete.Country, city: athlete.City, subscription: subscription}).end();
                }
            });
        }
    });
});


router.get('/profile/search/:search_string', auth().authenticate(), function (req, res) {
    athleteManager.searchAthletes(req.params.search_string, req.user.Id, function (error, athletes) {
        if(error) {
            logger.warn("Searching athletes error: "+error.message);
            res.json({success: false, error: error.message});
        } else {
            logger.warn("Athlete '"+req.user.Identificator+"' got athletes list");
            res.json({success: true, athletes: athletes});
        }
    });
});



module.exports = router;
