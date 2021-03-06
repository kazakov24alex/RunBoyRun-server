
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
var openRouter          = require('./routers/open_router');
var profileRouter       = require('./routers/profile_router');
var activityRouter      = require('./routers/activity_router');
var commentRouter       = require('./routers/comment_router');
var valueRouter         = require('./routers/value_router');
var subscriptionRouter  = require('./routers/subscription_route');

app.use('/', openRouter);
app.use('/api', profileRouter);
app.use('/api', activityRouter);
app.use('/api', commentRouter);
app.use('/api', valueRouter);
app.use('/api', subscriptionRouter);


// Main web-page
app.get('*', function (req, res){
    res.end('RunBoyRun server. Welcome!');
});


// Server launch
var port = process.env.PORT || config.server.defaultPort;
app.listen(port, function() {
    logger.info("Server started at " + port);
});
