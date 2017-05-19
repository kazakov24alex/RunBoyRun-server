
// ========================================
// DB Model for comment
// ========================================


var Sequelize = require("sequelize");

var sequelize = require("./../libs/sequelize");
var config = require("../config");

var AthleteModel    = require("./athlete");
var ActivityModel   = require("./activity");


// 'Comment' table model in MySQL DB
var CommentModel = sequelize.define("comment", {
    Id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Activity_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        /*references: {
            model: ActivityModel,
            key: "Id"
        }*/
    },
    Athlete_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Text: {
        type: Sequelize.STRING(140),
        allowNull: false
    },
    DateTime: {
        type: Sequelize.DATE,
        allowNull: false
    }
},{
    tableName: "comment",
    createdAt: false,
    updatedAt: false
});


module.exports = CommentModel;
