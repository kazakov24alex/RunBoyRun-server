

// ========================================
// DB Model for users
// ========================================


var Sequelize = require('sequelize');
var sequelize = require('./../libs/sequelize');


//Article table model in DB
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
        values: ['admin', 'user'],
        defaultValue: 'user'
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



