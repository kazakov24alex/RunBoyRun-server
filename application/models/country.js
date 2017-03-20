
// ========================================
// DB Model for cities
// ========================================


var Sequelize = require('sequelize');

var sequelize   = require('./../libs/sequelize');
var config      = require('../config');


// 'country' table model in MySQL DB
var Country = sequelize.define('country', {
    Code: {
        type: Sequelize.CHAR(3),
        allowNull: false,
        primaryKey: true,
        defaultValue: ''
    },
    Name: {
        type: Sequelize.CHAR(52),
        allowNull: false,
        defaultValue: ''
    },
    Continent: {
        type:   Sequelize.ENUM,
        allowNull: false,
        values: ['Asia','Europe','North America','Africa','Oceania','Antarctica','South America'],
        defaultValue: 'Asia'
    },
    Region: {
        type: Sequelize.CHAR(26),
        allowNull: false,
        defaultValue: ''
    },
    SurfaceArea: {
        type: Sequelize.FLOAT(10,2),
        allowNull: false,
        defaultValue: 0.00
    },
    IndepYear: {
        type: Sequelize.INTEGER(6),
        defaultValue: null
    },
    Population: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        defaultValue: 0
    },
    LifeExpectancy: {
        type: Sequelize.FLOAT(3,1),
        defaultValue: null
    },
    GNP: {
        type: Sequelize.FLOAT(10,2),
        defaultValue: null
    },
    GNPOld: {
        type: Sequelize.FLOAT(10,2),
        defaultValue: null
    },
    LocalName: {
        type: Sequelize.CHAR(45),
        allowNull: false,
        defaultValue: ''
    },
    GovernmentForm: {
        type: Sequelize.CHAR(45),
        allowNull: false,
        defaultValue: ''
    },
    HeadOfState: {
        type: Sequelize.CHAR(60),
        defaultValue: null
    },
    Capital: {
        type: Sequelize.INTEGER(11),
        defaultValue: null
    },
    Code2: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        defaultValue: ''
    }

}, {
    tableName: 'country',
    createdAt: false,
    updatedAt: false
});


module.exports = Country;