
// ========================================
// Module for managing subscriptions
// ========================================

var AthleteModel        = require('../../models/athlete');
var SubscriptionModel   = require('../../models/subscription');

var athleteManager  = require('./athlete_manager');

var errors = require('../../errors/errors');


subscriptionManager = {

    // *****************************************************************************************************************
    // Add new subscriptionRoutes to database.
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
        SubscriptionModel.findAll({
            where: {
                Athlete_id: athlete_id
            },
            attributes: ['Athlete_id', 'Subscriber_id'],
            include: [{
                model: AthleteModel,
                attributes: ['Id', 'Name', 'Surname'],
                required: true
            }]
        }).then(function (subscribtions) {
            return callback(null, subscribtions);

        }).catch(function (error) {
            return callback(error, null);
        });
    }

};

module.exports = subscriptionManager;
