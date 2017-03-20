
// ========================================
// DB Model for cities
// ========================================


var Sequelize = require('sequelize');

var sequelize = require('./../libs/sequelize');
var config = require('../config');


// 'city' table model in MySQL DB
var City = sequelize.define('city', {
    ID: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Name: {
        type: Sequelize.CHAR(35),
        allowNull: false,
        defaultValue: ''
    },
    CountryCode: {
        type: Sequelize.CHAR(3),
        allowNull: false,
        defaultValue: '',
        references: {
            model: 'country',
            key: 'Code'
        }
    },
    District: {
        type: Sequelize.CHAR(20),
        allowNull: false,
        defaultValue: ''
    },
    Population: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'city',
    createdAt: false,
    updatedAt: false
});


module.exports = City;
