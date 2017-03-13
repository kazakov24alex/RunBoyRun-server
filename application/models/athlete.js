
// ========================================
// DB Model for users
// ========================================


var Sequelize = require('sequelize');

var sequelize = require('./../libs/sequelize');
var config = require('../config');


// 'Athlete' table model in MySQL DB
var Athlete = sequelize.define('athlete', {
    name: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    surname: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    identificator: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    hashed_password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type:   Sequelize.ENUM,
        allowNull: false,
        values: [config.role.admin, config.role.user],
        defaultValue: config.role.user
    },
    birthday: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    country: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    city: {
        type: Sequelize.STRING(30),
        allowNull: false
    }
});


module.exports = Athlete;
