
// ========================================
// Module for managing athlete accounts
// ========================================


var ActivityModel   = require('../../models/activity');
var AthleteModel    = require('../../models/athlete');

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
        if(body.track == true && (body.timeline == null || body.route == null )) {
            return callback(new Error(errors.ACTIVITY_INCORRECT), null);
        }

        athleteManager.findAthleteIdByIdentificator(identificator, function(err, athlete_id) {
           if(err) {
               return callback(err, null);
           } else {

               var activity = {
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
                   Description:     body.description
               };

               if(body.timeline == null || body.route == null) {
                   activity.Route = null;
                   activity.TimeLine = null;
               } else {
           /*        console.log("JSON = "+JSON.stringify(body.route));
                   console.log("JSON = "+JSON.stringify(body.timeline));*/
                   activity.Route = { type: 'LineString', coordinates: body.route };
                   activity.TimeLine = { type: 'LineString', coordinates: body.timeline };
               }

               ActivityModel.create(activity).then(function(result) {
                   if (!result[1]) {
                       return callback(null, result.dataValues.Id);
                   }
               }).catch(function(error) {
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
            }
            return callback(null, activity);
        }).catch(function(error) {
            return callback(error, null);
        });

    },

    getActivitiesPage: function (athlete_id, activitiesNum, pageNum, callback) {

        ActivityModel.findAll({
            where: {Athlete_id : athlete_id},
            order:  [['id', 'DESC']],
            attributes: ['Id', 'Sport_type', 'DateTime_start', 'Duration', 'Distance', 'Description'],
            include: [{
                model: AthleteModel,
                attributes: ['Id', 'Name', 'Surname'],
                required: true
            }]
        }).then(function(activity) {
            if (!activity || activity == "") {
                return callback(null, null);
            } else {
                if(!activitiesNum)
                    return callback(new Error(errors.ACTIVITIES_NUM_ABSENT), null);
                if(!pageNum)
                    return callback(new Error(errors.ACTIVITIES_PAGENUM_ABSENT), null);

                var pageEnd = pageNum*activitiesNum;

                console.log("SUB="+(pageEnd-activity.length)+"  activNum="+activitiesNum);

                if( (pageEnd-activity.length) >= activitiesNum) {
                    return callback(null, null)
                }

                if(pageEnd > activity.length) {
                    pageEnd = activity.length;
                }


                var newInd = 0;
                var newActivities = [];
                for (i = (pageNum-1)*activitiesNum; i < pageEnd; i++, newInd++) {
                    newActivities[newInd] = {
                        id:                 activity[i].dataValues.Id,
                        sport_type:         activity[i].dataValues.Sport_type,
                        datetime_start:     activity[i].dataValues.DateTime_start,
                        duration:           activity[i].dataValues.Duration,
                        distance:           activity[i].dataValues.Distance,
                        description:        activity[i].dataValues.Description,
                        athlete_id:         activity[i].dataValues.athlete.Id,
                        name:               activity[i].dataValues.athlete.Name,
                        surname:            activity[i].dataValues.athlete.Surname,
                        order:              activity.length - i
                    };

                }

                return callback(null, newActivities);
            }
        })
    },


    getRoute: function (id, callback) {
        ActivityModel.findOne({
            where: {Id: id},
            attributes: ['Route', 'TimeLine'],
        }).then(function(activity) {
            if (!activity) {
                return callback(new Error(errors.ACTIVITY_NOT_FOUND, null));
            }

            if(!activity.Route || !activity.TimeLine) {
                return callback(null, null);
            }

            var route = [];

            for(var i = 0; i < activity.Route.coordinates.length; i++) {
                var point = [];
                point[0] = activity.Route.coordinates[i][0];
                point[1] = activity.Route.coordinates[i][1];
                point[2] = activity.TimeLine.coordinates[i][0];

                route[i] = point;
            }

            return callback(null, route);
        }).catch(function(error) {
            return callback(error, null);
        });

    }



};

module.exports = activityManager;
