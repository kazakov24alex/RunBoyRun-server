
// Entry point
var express     = require('express');
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var path        = require('path');

var config      = require('./config');
var DBManager   = require('./libs/database');
var logger      = require('./libs/logger')(module);
var auth        = require('./libs/auth');


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
var profileRoutes = require('./routes/profile');
var openRoutes      = require('./routes/open');
var activityRoutes  = require('./routes/activity_router');
app.use('/', openRoutes);
app.use('/api', profileRoutes);

app.use('/api', activityRoutes);


// Main web-page
app.get('*', function (req, res){
    res.end('RunBoyRun server. Welcome!');
});


// Server launch
var port = process.env.PORT || config.server.defaultPort;
app.listen(port, function() {
    logger.info("Server started at " + port);
});
