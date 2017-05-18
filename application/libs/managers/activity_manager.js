
// ========================================
// Module for managing athlete accounts
// ========================================


var ActivityModel   = require('../../models/activity');

var athleteManager  = require('./athlete_manager');

var config = require('../../config');
var errors = require('../../errors/errors');


activityManager = {

    // *****************************************************************************************************************
    // Add new activity to database.
    // On success: callback(null, acitivity_id)
    // On failure: callback(err, null)
    // *****************************************************************************************************************
    addActivity: function (identificator, body, callback) {
        if(body.track == true && (body.timestep == null || body.route == null )) {
            return callback(new Error(errors.ACTIVITY_INCORRECT), null);
        }

        athleteManager.findAthleteIdByIdentificator(identificator, function(err, athlete_id) {
           if(err) {
               return callback(err, null);
           } else {
               console.log("ROUTE = "+body);
               console.log("POINT = "+body.route[0].toString());

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
                   TimeStep:        body.timestep,
                   Route:           { type: 'LineString', coordinates: body.route }
               }).then(function(result) {
                   console.log("PASSED 1");
                   if (!result[1]) {
                       console.log("PASSED 2");
                       return callback(null, result.dataValues.Id);
                   }
               }).catch(function(error) {
                   console.log("ERROR 1");
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
                return callback(null, activity);
            }
        }).catch(function(error) {
            return callback(error, null);
        });

    }



};

module.exports = activityManager;
