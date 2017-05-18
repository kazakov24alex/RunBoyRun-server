
// ========================================
// Module for managing comments
// ========================================

var CommentModel    = require('../../models/comment');

var athleteManager  = require('./athlete_manager');

var errors = require('../../errors/errors');


commentManager = {

    // *****************************************************************************************************************
    // Add new comment to database.
    // On success: callback(null, comment_id)
    // On failure: callback(err, null)
    // *****************************************************************************************************************
    addComment: function (identificator, body, callback) {
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


    }


};

module.exports = commentManager;