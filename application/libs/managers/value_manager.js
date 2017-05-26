
// ==============================================
// Module for managing likes/dislikes of athletes
// ==============================================


var ValueModel   = require('../../models/value');
var AthleteModel = require('../../models/athlete');

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
    },

    getPreviewValue : function (activity_id, identificator, callback) {
        athleteManager.findAthleteIdByIdentificator(identificator, function(err, athlete_id) {
            if (err) {
                return callback(err, null);
            } else {
                ValueModel.findAll({
                    where: {
                        Activity_id: activity_id
                    }
                }).then(function (values) {
                    var values_stat = {
                        like_num: 0,
                        dislike_num: 0,
                        my_value: null
                    };

                    console.log("VALUES_LENGTH = "+values.length);
                    for(var i=0; i<values.length; i++) {
                        if(values[i].dataValues.Value == true)
                            values_stat.like_num++;
                        if(values[i].dataValues.Value == false)
                            values_stat.dislike_num++;
                        if(values[i].dataValues.Athlete_id == athlete_id)
                            values_stat.my_value =  values[i].dataValues.Value;
                    }

                    return callback(null, values_stat);

                }).catch(function (error) {
                    return callback(error, null);
                });
            }
        });

    },

    getAuthorLikeValues : function (activity_id, callback) {
        ValueModel.findAll({
            where: {
                Activity_id: activity_id
            },
            attributes: ['Value'],
            include: [{
                model: AthleteModel,
                attributes: ['Id', 'Name', 'Surname'],
                required: true
            }]
        }).then(function (values) {

            var valuesArr = [];

            for(var i = 0; i < values.length; i++) {
                valuesArr[i] = {
                    value:      values[i].dataValues.Value,
                    athlete_id: values[i].dataValues.athlete.Id,
                    name:       values[i].dataValues.athlete.Name,
                    surname:    values[i].dataValues.athlete.Surname
                };
            }

            return callback(null, valuesArr);

        }).catch(function (error) {
            return callback(error, null);
        });
    },



    addPreviewValuesToActivitiesArr : function (activities, identificator, callback) {
        var NUM = activities.length;
        for (var i = 0; i < activities.length; i++) {

            valueManager.getPreviewValueNew(activities[i].id, identificator, i, function (err, values_stat) {
                if (err) {
                    return callback(err, null);
                }

                activities[values_stat.index].like_num = values_stat.like_num;
                activities[values_stat.index].dislike_num = values_stat.dislike_num;
                activities[values_stat.index].my_value = values_stat.my_value;

                NUM--;
                if (NUM == 0) {
                    return callback(null, activities);
                }
            });

        }
    },



    getPreviewValueNew : function (activity_id, identificator, idx, callback) {
        athleteManager.findAthleteIdByIdentificator(identificator, function(err, athlete_id) {
            if (err) {
                return callback(err, null);
            } else {
                ValueModel.findAll({
                    where: {
                        Activity_id: activity_id
                    }
                }).then(function (values) {
                    var values_stat = {
                        like_num: 0,
                        dislike_num: 0,
                        my_value: null,
                        index: idx
                    };

                    for(var i=0; i<values.length; i++) {
                        if(values[i].dataValues.Value == true)
                            values_stat.like_num++;
                        if(values[i].dataValues.Value == false)
                            values_stat.dislike_num++;
                        if(values[i].dataValues.Athlete_id == athlete_id)
                            values_stat.my_value =  values[i].dataValues.Value;
                    }

                    return callback(null, values_stat);

                }).catch(function (error) {
                    return callback(error, null);
                });
            }
        });

    }



};

module.exports = valueManager;
