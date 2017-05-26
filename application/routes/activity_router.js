
// ========================================
// Router for activity API
// ========================================


var express = require('express');
var router = express.Router();

var activityManager = require('../libs/managers/activity_manager');
var valueManager    = require('../libs/managers/value_manager');

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
            return;
        }

        var activityJSON = {
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
            description:    activity.Description
        };

        if(activity.Track == true) {
            activityJSON.route = activity.Route.coordinates;
            activityJSON.timeline = activity.TimeLine.coordinates;
        } else {
            activityJSON.route = null;
            activityJSON.timeline = null;
        }

        valueManager.getPreviewValue(req.params.id, req.user.Identificator, function(error, values) {
            activityJSON.like_num = values.like_num;
            activityJSON.dislike_num = values.dislike_num;
            activityJSON.my_value = values.my_value;

            if(err) {
                res.json({success: false, error: err.message}).end();
                logger.warn("athlete '"+req.user.Identificator+"' getting activity ERROR: "+err.message);
            } else {
                res.json(activityJSON).end();
                logger.info("athlete '"+req.user.Identificator+"' got activity (ID="+req.params.id+")");
            }
        });

    });
});

router.get('/activity/:athlete_id/:activitiesNum/:pagesNum', auth().authenticate(), function (req, res) {
    activityManager.getActivityPage(req.params.athlete_id, req.params.activitiesNum, req.params.pagesNum, function (err, activities) {
        if (err) {
            res.json({success: false, error: err.message}).end();
            logger.warn("athlete '" + req.params.athlete_id + "' getting activities page ERROR: " + err.message);
            return;
        } else {

        }
    });
});

module.exports = router;
