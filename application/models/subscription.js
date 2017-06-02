
// ========================================
// DB Model for subscriptionRoutes
// ========================================


var Sequelize = require("sequelize");

var sequelize = require("./../libs/sequelize");
var config = require("../config");


// 'Subscription' table model in MySQL DB
var SubscriptionModel = sequelize.define("subscription", {
    Id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Athlete_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Subscriber_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
},{
    tableName: "subscription",
    createdAt: false,
    updatedAt: false
});


module.exports = SubscriptionModel;
