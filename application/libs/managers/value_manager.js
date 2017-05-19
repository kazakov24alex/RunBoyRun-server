
// ==============================================
// Module for managing likes/dislikes of athletes
// ==============================================


var ValueModel   = require('../../models/value');
/*
var athleteManager  = require('./athlete_manager');
var commentManager  = require('./comment_manager');*/

var config = require('../../config');
var errors = require('../../errors/errors');


valueManager = {

    // *****************************************************************************************************************
    // Add new dis/like to database.
    // On success: callback(null, value_id)
    // On failure: callback(err, null)
    // *****************************************************************************************************************
    handleValue: function (identificator, body, callback) {
        if(!body.activity_id) {
            return callback(new Error(errors.DIS_LIKE_INCORRECT_BODY), null);
        }


        athleteManager.findAthleteIdByIdentificator(identificator, function(err, athlete_id) {
            if (err) {
                return callback(err, null);
            } else {
                ValueModel.findOne({
                    where: {
                        Activity_id: body.activity_id,
                        Athlete_id:  identificator
                    }
                }).then(function (value) {
                    if (!value) {
                        valueManager.addValue(athlete_id, body, function (error, value_id) {
                            return callback(error, value_id);
                        })
                    } else {
                        return console.log("LIKE FOUND");
                    }
                });
            }

        })

    },


    addValue : function (identificator, body, callback) {

        var value = {
            Activity_id:    body.activity_id,
            Athlete_id:     identificator,
            DateTime:       new Date(),
            Value:          body.value
        }

        ValueModel.create(value).then(function(result) {
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






};

module.exports = valueManager;
