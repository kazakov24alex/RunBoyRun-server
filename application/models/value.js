
// ========================================
// DB Model for activity
// ========================================


var Sequelize = require("sequelize");

var sequelize = require("./../libs/sequelize");
var config = require("../config");

var AthleteModel = require("./athlete");


// 'DisLike' table model in MySQL DB
var ValueModel = sequelize.define("value", {
    Id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Activity_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
    },
    Athlete_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    DateTime: {
        type: Sequelize.DATE,
        allowNull: false
    },
    Value: {
        type: Sequelize.BOOLEAN,    // true - like, false - dislike
        allowNull: false
    }

},{
    tableName: "value",
    createdAt: false,
    updatedAt: false
});


module.exports = ValueModel;
