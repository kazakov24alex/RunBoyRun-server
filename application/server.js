
// Entry point
var express = require('express');
const mysql = require('mysql');

const config = require('./config');
const log = require('./libs/logger')(module);

// Create express.js app
var app = express();


const pool = mysql.createPool(config.db);



app.get('/db', function (req, res){

    pool.query('SELECT 2+2 AS solution', function (error, results, fields) {
        if (error) {
            console.log(error.message);
            throw error;
        }
        log.info('The solution is: ', results[0].solution);
    });

});

app.get('*', function (req, res){
    res.end('RunBoyRun server. Welcome!');
});


// Server launch
var port = process.env.PORT || config.server.defaultPort;
app.listen(port, function() {
    console.log("Server started at " + port);
});
