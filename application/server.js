
// Entry point
var express     = require('express');
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var path        = require('path');
var mysql       = require('mysql');

var config      = require('./config');
var DBManager   = require('./libs/db_manager');
var logger      = require('./libs/logger')(module);
var auth        = require('./libs/auth');


var Athlete     = require('./models/athlete');


// Create express.js app
var app = express();

// Adding middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());   // Standart module for JSON parsing of requests
// запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)
app.use(express.static(path.join(__dirname, config.server.staticPath)));
app.use(auth().initialize());


// Check connection with the Database
DBManager.connect();



// Routes
var openRoutes = require('./routes/open');
app.use('/', openRoutes);



app.get('*', function (req, res){
    res.end('RunBoyRun server. Welcome!');
});


// Server launch
var port = process.env.PORT || config.server.defaultPort;
app.listen(port, function() {
    console.log("Server started at " + port);
});
