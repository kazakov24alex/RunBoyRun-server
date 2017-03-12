

// ========================================
// DB Model for users
// ========================================


var Sequelize = require('sequelize');
var sequelize = require('./../libs/sequelize');


//Article table model in DB
var Athlete = sequelize.define('athlete', {
    name: Sequelize.STRING,
    surname: Sequelize.STRING
});


module.exports = Athlete;



