var express = require('express');
var router = express.Router();

var athleteManager = require('../libs/managers/athlete_manager');


var logger = require('../libs/logger')(module);
var config = require('../config');
var errors = require('../errors/errors');
var auth   = require('../libs/auth');


router.get('/profile_info', auth().authenticate(), function (req, res) {
    athleteManager.getProfileInformation(req.user.Identificator, function (err, athlete) {
        if (err){
            logger.warn("Error in indeficator");
            res.json({success: false, error: err.message});
        }
        else{
            res.json({success: true, name: athlete.Name, surname: athlete.Surname, birthday: athlete.Birthday,
                sex: athlete.Sex, country: athlete.Country, city: athlete.City}).end();
            logger.warn("Getting profile info");
        }
    });
});

module.exports = router;
//router.get
//по принципу последнего
//получить иденти и кинуть в функцию по получению инфы