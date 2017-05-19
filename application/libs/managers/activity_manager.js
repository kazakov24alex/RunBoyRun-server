
// ========================================
// Module for managing athlete accounts
// ========================================


var ActivityModel   = require('../../models/activity');

var athleteManager  = require('./athlete_manager');
var commentManager  = require('./comment_manager');

var config = require('../../config');
var errors = require('../../errors/errors');


activityManager = {

    // *****************************************************************************************************************
    // Add new activity to database.
    // On success: callback(null, acitivity_id)
    // On failure: callback(err, null)
    // *****************************************************************************************************************
    addActivity: function (identificator, body, callback) {
        if(body.track == true && (body.timeline == null || body.route == null )) {
            return callback(new Error(errors.ACTIVITY_INCORRECT), null);
        }

        athleteManager.findAthleteIdByIdentificator(identificator, function(err, athlete_id) {
           if(err) {
               return callback(err, null);
           } else {
               ActivityModel.create({
                   Athlete_id:      athlete_id,
                   Track:           body.track,
                   Sport_type:      body.sport_type,
                   DateTime_start:  body.datetime_start,
                   Temperature:     body.temperature,
                   Weather:         body.weather,
                   Relief:          body.relief,
                   Condition:       body.condition,
                   Duration:        body.duration,
                   Distance:        body.distance,
                   Average_speed:   body.average_speed,
                   Tempo:           body.tempo,
                   Description:     body.description,
                   Route:           { type: 'LineString', coordinates: body.route },
                   TimeLine:        { type: 'LineString', coordinates: body.timeline }
               }).then(function(result) {
                   console.log("PASSED 1");
                   if (!result[1]) {
                       console.log("PASSED 2");
                       return callback(null, result.dataValues.Id);
                   }
               }).catch(function(error) {
                   console.log("ERROR 1" + error.message);
                   return callback(error, null);
               });
           }
        });

    },


    // *****************************************************************************************************************
    // Find and return activity by activity_id.
    // On success: callback(null, acitivity)
    // On failure: callback(err, null)
    // *****************************************************************************************************************
    getActivity: function (id, callback) {
        ActivityModel.findOne({
            where: {Id: id}
        }).then(function(activity) {
            if (!activity) {
                return callback(new Error(errors.ACTIVITY_NOT_FOUND, null));
            } else {
                commentManager.getComments(id, 3, function (error, comments) {
                    if(error)
                        return callback(error, null);
                    activity.comments = comments;

                    return callback(null, activity);
                });


            }
        }).catch(function(error) {
            return callback(error, null);
        });

    }



};

module.exports = activityManager;
