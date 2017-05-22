
// ========================================
// Module for managing comments
// ========================================

var AthleteModel   = require('../../models/athlete');
var CommentModel    = require('../../models/comment');

var athleteManager  = require('./athlete_manager');

var errors = require('../../errors/errors');


commentManager = {

    // *****************************************************************************************************************
    // Add new comment to database.
    // On success: callback(null, comment_id)
    // On failure: callback(err, null)
    // *****************************************************************************************************************
    addComment : function (identificator, body, callback) {
        if(!body.text) {
            return callback(new Error(errors.COMMENT_TEXT_ABSENT), null);
        }

        athleteManager.findAthleteIdByIdentificator(identificator, function (error, athlete_id) {
            if(error) {
                return callback(new Error(errors.COMMENT_INCORRECT_IDENTIFICATOR), null);
            }

            CommentModel.create({
                Activity_id:    body.activity_id,
                Athlete_id:     athlete_id,
                Text:           body.text,
                DateTime:       new Date()

            }).then(function(result) {
                if (!result[1]) {
                    return callback(null, result.dataValues.Id);
                }
            }).catch(function(err) {
                return callback(err, null);
            });
        })
    },


    // *****************************************************************************************************************
    // Get all comments of activity.
    // On success: callback(null, comments)
    // On failure: callback(err, null)
    // *****************************************************************************************************************
    getComments : function(activity_id, commentsNum, callback) {
        CommentModel.findAll({
            where: {Activity_id: activity_id},
            order:  [['DateTime', 'DESC']],
            attributes: ['DateTime', 'Text'],
            include: [{
                model: AthleteModel,
                attributes: ['Id', 'Name', 'Surname'],
                required: true
            }]
        }).then(function(comments) {
            if (!comments || comments == "") {
                return callback(null, null);
            } else {

                if(commentsNum) {
                    var newComments = [];
                    for (i = 0; i < commentsNum; i++) {
                        newComments[i] = {
                            text:       comments[i].dataValues.Text,
                            date_time:  comments[i].dataValues.DateTime,
                            athlete_id: comments[i].dataValues.athlete.Id,
                            name:       comments[i].dataValues.athlete.Name,
                            surname:     comments[i].dataValues.athlete.Surname
                        };
                    }
                    return callback(null, newComments);
                } else {
                    return callback(null, comments);
                }
            }
        })

    }


};

module.exports = commentManager;