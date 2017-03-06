
// Entry point
var express = require('express');
var config = require('./config');



// Create express.js app
var app = express();


app.get('*', function (req, res){
    res.end('RunBoyRun server. Welcome!');
});


// Server launch
var port = process.env.PORT || config.server.defaultPort;
app.listen(port, function() {
    console.log("RunBoyRun server started at " + port);
});
