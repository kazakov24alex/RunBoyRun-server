
// ========================================
// Router for open endpoints
// ========================================

var express = require('express');
var router = express.Router();

var athleteManager = require('../libs/athlete_manager');
var logger = require('../libs/logger')(module);
var auth = require('../libs/auth');


// Registration of new User
router.post('/signup', function (req, res) {
    athleteManager.createUser(req.body, 'user', function (err) {
        if(err) {
            res.json({success: false, error: err.message}).end();
            logger.warn('Creating user '+req.body.name+' error: '+err.message);
        }  else {
            athleteManager.requestToken(req.body.identificator, req.body.password, function(err, athlete) {
                if(err) {
                    res.json({success: false, error: err.message}).end();
                    logger.warn('Requesting token error (create user): '+err.message);
                } else {
                    res.json({success: true, token: athlete.token}).end();
                    logger.info('Created new user. Login: ' + req.body.login);
                }
            });
        }
    })
});

// Autharization of new User
router.get('/admin_test', auth().authenticate(), function (req, res) {
    if(req.user.role == 'admin') {
        res.json({success: true, message: 'You are ADMIN. Access allowed.', user: req.user}).end();
    } else {
        res.json({success: false, message: 'You are USER. Access denied.', user: req.user}).end();
    }
});


module.exports = router;
