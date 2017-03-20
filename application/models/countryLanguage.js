
// ========================================
// DB Model for country languages
// ========================================


var Sequelize = require('sequelize');

var sequelize   = require('./../libs/sequelize');
var config      = require('../config');


// 'countryLanguage' table model in MySQL DB
var CountryLanguage = sequelize.define('countrylanguage', {
    CountryCode: {
        type: Sequelize.CHAR(3),
        primaryKey: true,
        allowNull: false,
        defaultValue: '',
        references: {
            model: 'country',
            key: 'Code'
        }
    },
    Language: {
        type: Sequelize.CHAR(30),
        primaryKey: true,
        allowNull: false,
        defaultValue: ''
    },
    IsOfficial: {
        type:   Sequelize.ENUM,
        allowNull: false,
        values: ['T', 'F'],
        defaultValue: 'F'
    },
    Percentage: {
        type: Sequelize.FLOAT(4,1),
        allowNull: false,
        defaultValue: 0.0
    }
}, {
    tableName: 'countrylanguage',
    createdAt: false,
    updatedAt: false
});


module.exports = CountryLanguage;