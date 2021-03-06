
// ========================================
// DB Model for users
// ========================================


var Sequelize = require('sequelize');

var sequelize = require('./../libs/sequelize');
var config = require('../config');


// 'Athlete' table model in MySQL DB
var AthleteModel = sequelize.define('athlete', {
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Name: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    Surname: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    Identificator: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
    },
    Hashed_password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Role: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: [config.role.admin, config.role.user],
        defaultValue: config.role.user
    },
    Sex: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["male", "famale"],
        defaultValue: "male"
    },
    Birthday: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    Country: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    City: {
        type: Sequelize.STRING(30),
        allowNull: false
    }
},{
    tableName: 'athlete'
});


module.exports = AthleteModel;
