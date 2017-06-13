
// ========================================
// Module for managing subscriptions
// ========================================

var AthleteModel        = require('../../models/athlete');
var SubscriptionModel   = require('../../models/subscription');

var errors = require('../../errors/errors');


subscriptionManager = {

    // *****************************************************************************************************************
    // Add new subscription to database.
    // On success: callback(null)
    // On failure: callback(err)
    // *****************************************************************************************************************
    handleSubscribe: function (subscriber_id, athlete_id, callback) {
        if(!subscriber_id)  { return callback(new Error(errors.SUBSCRIBE_SUBSCRIBER_ID_ABSENT)); }
        if(!athlete_id)     { return callback(new Error(errors.SUBSCRIBE_ATHLETE_ID_ABSENT)); }

        SubscriptionModel.findOne({
            where: {
                Athlete_id:     athlete_id,
                Subscriber_id:  subscriber_id
            }
        }).then(function (subscription) {
            if (!subscription) {
                subscriptionManager.addSubscribe(subscriber_id, athlete_id, function (error) {
                    return callback(error);
                });
            } else {
                subscriptionManager.removeSubscribe(subscriber_id, athlete_id, function (error) {
                    return callback(error);
                });
            }
        }).catch(function(error) {
            return callback(error);
        });



    },


    addSubscribe: function (subscriber_id, athlete_id, callback) {
        var subscription = {
            Athlete_id:     athlete_id,
            Subscriber_id:  subscriber_id
        };

        SubscriptionModel.create(subscription).then(function(result) {
            if (!result[1]) {
                return callback(null);
            }
        }).catch(function(error) {
            return callback(error);
        });
    },

    removeSubscribe: function (subscriber_id, athlete_id, callback) {
        SubscriptionModel.destroy({
            where: {
                Athlete_id:     athlete_id,
                Subscriber_id:  subscriber_id
            }
        }).then(function(result) {
            callback(null);
        }).catch(function(error) {
            return callback(error);
        });
    },


    getSubscribers: function (athlete_id, callback) {
        if(!athlete_id)     { return callback(new Error(errors.SUBSCRIBE_ATHLETE_ID_ABSENT)); }

        SubscriptionModel.findAll({
            where: {
                Athlete_id: athlete_id
            },
            attributes: ['Subscriber_id'],
            include: [{
                model: AthleteModel,
                attributes: ['Name', 'Surname'],
                required: true
            }]
        }).then(function (subscribers) {
            var subscribersArr = [];
            for (var i = 0; i < subscribers.length; i++) {
                subscribersArr[i] = {
                    id:  subscribers[i].dataValues.Subscriber_id,
                    name:           subscribers[i].dataValues.athlete.Name,
                    surname:        subscribers[i].dataValues.athlete.Surname
                };
            }

            return callback(null, subscribersArr);

        }).catch(function (error) {
            return callback(error, null);
        });
    },

    // *****************************************************************************************************************
    // Check subscription.
    // On success: callback(null, true/false)
    // On failure: callback(err, null)
    // *****************************************************************************************************************
    checkSubscription: function (subscriber_id, athlete_id, callback) {
        if(!subscriber_id)  { return callback(new Error(errors.SUBSCRIBE_SUBSCRIBER_ID_ABSENT)); }
        if(!athlete_id)     { return callback(new Error(errors.SUBSCRIBE_ATHLETE_ID_ABSENT)); }

        if(subscriber_id == athlete_id) {
            return callback (null, null);
        }

        SubscriptionModel.findOne({
            where: {
                Athlete_id:     athlete_id,
                Subscriber_id:  subscriber_id
            }
        }).then(function (subscription) {
            if (!subscription) {
                return callback(null, false);
            } else {
                return callback(null, true);
            }
        }).catch(function(error) {
            return callback(error, null);
        });

    },

    getSubscriptions:  function (athlete_id, callback) {
        subscriptionManager.getSubscriptionsID(athlete_id, function (error, idArr) {
            AthleteModel.findAll({
                where: {
                    Id: idArr
                },
                attributes: ['Id', 'Name', 'Surname']

            }).then(function (athletes) {
                var arr = [];
                for(var i = 0; i < athletes.length; i++) {
                    var newAthlete = {
                        id: athletes[i].Id,
                        Name: athletes[i].Name,
                        Surname: athletes[i].Surname
                    };
                    arr.push(newAthlete);
                }

                return callback(null, arr);

            }).catch(function (error) {
                return callback(error, null);
            });
        });


    },


    getSubscriptionsID: function (athlete_id, callback) {
        if(!athlete_id)     { return callback(new Error(errors.SUBSCRIBE_ATHLETE_ID_ABSENT)); }

        SubscriptionModel.findAll({
            where: {
                Subscriber_id: athlete_id
            },
            attributes: ['Athlete_id']

        }).then(function (subscriptions) {

            var subscriptionsArr = [];
            for(var i = 0; i < subscriptions.length; i++) {
                subscriptionsArr.push(subscriptions[i].dataValues.Athlete_id)
            }

            return callback(null, subscriptionsArr);

        }).catch(function (error) {
            return callback(error, null);
        });
    }


};

module.exports = subscriptionManager;
