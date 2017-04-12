
// ========================================
// DB Model for activity
// ========================================


var Sequelize = require("sequelize");

var sequelize = require("./../libs/sequelize");
var config = require("../config");

var AthleteModel = require("./athlete");


// 'Activity' table model in MySQL DB
var ActivityModel = sequelize.define("activity", {
    Id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Athlete_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: AthleteModel,
            key: "Id"
        }
    },
    Track: {    // TRUE - track, FALSE - not track
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    Sport_type: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["run" , "bicycle", "ski", "walking"],
        defaultValue: "run"
    },
    DateTime_start: {
        type: Sequelize.DATE,
        allowNull: false
    },
    Temperature: {
        type: Sequelize.INTEGER(2),
        allowNull: false
    },
    Weather: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["sunny" , "clouds", "rain", "snow"],
        defaultValue: "sunny"
    },
    Relief: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["stadium", "park", "cross-country", "hills"],
        defaultValue: "stadium"
    },
    Condition: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["good", "medium", "tired", "beated"],
        defaultValue: "good"
    },
    Duration: {
        type: Sequelize.TIME,
        allowNull: false
    },
    Distance: {
        type: Sequelize.FLOAT(6,2).UNSIGNED,
        allowNull: false
    },
    Average_speed: {
        type: Sequelize.FLOAT(4,2).UNSIGNED,
        allowNull: false
    },
    Tempo: {
        type: Sequelize.FLOAT(5,2).UNSIGNED,
        allowNull: false
    },
    Description: {
        type: Sequelize.STRING(300),
        allowNull: true
    },

    TimeStep: {
        type: Sequelize.INTEGER(2).UNSIGNED,
        allowNull: true
    },
    Route: {
        type: Sequelize.GEOMETRY("LINESTRING"),
        allowNull: true
    }
},{
    tableName: "activity"
});


module.exports = ActivityModel;
