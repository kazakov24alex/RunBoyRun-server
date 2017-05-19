
// ========================================
// Router for activity API
// ========================================


var express = require('express');
var router = express.Router();

var activityManager = require('../libs/managers/activity_manager');

var logger = require('../libs/logger')(module);
var config = require('../config');
var auth   = require('../libs/auth');


// Addition of new athlete's activity
router.post('/activity', auth().authenticate(), function (req, res) {
    activityManager.addActivity(req.user.Identificator, req.body, function (err, activity_id) {
        if(err) {
            res.json({success: false, error: err.message}).end();
            logger.warn("athlete '"+req.user.Identificator+"' addition activity ERROR: "+err.message);
        } else {
            res.json({success: true, activity_id: activity_id}).end();
            logger.info("athlete '"+req.user.Identificator+"' added activity (ID="+activity_id+")");
        }
    });
});


// Getting of activity by activity_id
router.get('/activity/:id', auth().authenticate(), function (req, res) {
    activityManager.getActivity(req.params.id, function (err, activity) {
        if(err) {
            res.json({success: false, error: err.message}).end();
            logger.warn("athlete '"+req.user.Identificator+"' getting activity ERROR: "+err.message);
        } else {
            res.json({
                success:        true,
                id:             activity.Id,
                athlete_id:     activity.Athlete_id,
                track:          activity.Track,
                sport_type:     activity.Sport_type,
                datetime_start: activity.DateTime_start,
                temperature:    activity.Temperature,
                weather:        activity.Weather,
                relief:         activity.Relief,
                condition:      activity.Condition,
                duration:       activity.Duration,
                distance:       activity.Distance,
                average_speed:  activity.Average_speed,
                tempo:          activity.Tempo,
                description:    activity.Description,
                comments:       activity.comments,
                route:          activity.Route.coordinates,
                timeline:      activity.TimeLine
            }).end();
            logger.info("athlete '"+req.user.Identificator+"' got activity (ID="+req.params.id+")");
        }
    });
});

module.exports = router;
