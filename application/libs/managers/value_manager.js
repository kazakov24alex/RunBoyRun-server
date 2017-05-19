
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
                        Athlete_id:  athlete_id
                    }
                }).then(function (value) {
                    if (!value) {
                        valueManager.addValue(athlete_id, body, function (error, value_id) {
                            return callback(error, value_id);
                        });
                    } else {
                        if(value.Value == body.value) {
                            valueManager.removeValue(athlete_id, body, function (error, value_id) {
                                return callback(error, value_id);
                            });
                        } else {
                            value.updateAttributes({
                                Value: body.value
                            }).then(function (new_value) {
                                if(!new_value) {
                                    return callback(new Error(errors.VALUE_CHANGING_FAILED), null);
                                }
                                return callback(null, new_value.dataValues.Id);
                            }).catch(function(error) {
                                return callback(error, null);
                            });
                        }
                    }
                }).catch(function(error) {
                    return callback(error, null);
                });
            }

        })

    },


    addValue : function (athlete_id, body, callback) {
        var value = {
            Activity_id:    body.activity_id,
            Athlete_id:     athlete_id,
            DateTime:       new Date(),
            Value:          body.value
        };

        ValueModel.create(value).then(function(result) {
            if (!result[1]) {
                return callback(null, result.dataValues.Id);
            }
        }).catch(function(error) {
            return callback(error, null);
        });
    },


    removeValue : function (athlete_id, body, callback) {
        ValueModel.destroy({
            where: {
                Athlete_id:  athlete_id,
                Activity_id: body.activity_id
            }
        }).then(function(result) {
            callback(null, null);
        }).catch(function(error) {
            return callback(error, null);
        });
    }



};

module.exports = valueManager;
