

// ========================================
// Router for activity API
// ========================================


var express = require('express');
var router = express.Router();

var subscriptionManager = require('../libs/managers/subscription_manager');

var logger = require('../libs/logger')(module);
var config = require('../config');
var auth   = require('../libs/auth');


// Addition of new subscriptionRouter
router.post('/subs', auth().authenticate(), function (req, res) {
    subscriptionManager.handleSubscribe(req.user.Id, req.body.athlete_id, function (err) {
        if(err) {
            res.json({success: false, error: err.message}).end();
            logger.warn("athlete '"+req.user.Identificator+"' subscription ERROR: "+err.message);
        } else {
            res.json({success: true}).end();
            logger.info("athlete '"+req.user.Identificator+"' subscribed on (ID="+req.body.athlete_id+")");
        }
    });
});



// Get all subscribers of athlete
router.get('/subs/:athlete_id', auth().authenticate(), function (req, res) {
    var athlete_id = req.params.athlete_id;
    if(athlete_id == 0) {
        athlete_id = req.user.Id;
    }
    subscriptionManager.getSubscribers(athlete_id, function (err, subscribers) {
        if(err) {
            res.json({success: false, error: err.message}).end();
            logger.warn("athlete '"+req.user.Identificator+"' getting subscriptions ERROR: "+err.message);
        } else {
            res.json({success: true, subscribers: subscribers}).end();
            logger.info("athlete '"+req.user.Identificator+"' got subscriptions (ID="+req.params.athlete_id+")");
        }
    });
});


router.get('/subscriptions/:athlete_id', auth().authenticate(), function (req, res) {
    var athlete_id = req.params.athlete_id;
    if(athlete_id == 0) {
        athlete_id = req.user.Id;
    }
    subscriptionManager.getSubscriptions(athlete_id, function (err, subscriptions) {
        if(err) {
            res.json({success: false, error: err.message}).end();
            logger.warn("athlete '"+req.user.Identificator+"' getting subscriptions ERROR: "+err.message);
        } else {
            res.json({success: true, subscribers: subscriptions}).end();
            logger.info("athlete '"+req.user.Identificator+"' got subscriptions (ID="+req.params.athlete_id+")");
        }
    });
});


module.exports = router;
