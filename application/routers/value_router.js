
// ========================================
// Router for like/dislike API
// ========================================


var express = require('express');
var router = express.Router();

var valueManager = require('../libs/managers/value_manager');

var logger = require('../libs/logger')(module);
var config = require('../config');
var auth   = require('../libs/auth');


// Addition of new athlete's comment
router.post('/value', auth().authenticate(), function (req, res) {
    valueManager.handleValue(req.user.Identificator, req.body, function (err, value_id) {
        if(err) {
            res.json({success: false, error: err.message}).end();
            logger.warn("athlete '"+req.user.Identificator+"' changing value ERROR: "+err.message);
        } else {
            valueManager.getPreviewValue(req.body.activity_id, req.user.Identificator, function (err, newsWithValues) {
                if (err) {
                    res.json({success: false, error: err.message}).end();
                    logger.warn("athlete '" + req.params.athlete_id + "' getting activities page ERROR: " + err.message);
                } else {
                    res.json({success: true, like_num: newsWithValues.like_num, dislike_num: newsWithValues.dislike_num, my_value
                        : newsWithValues.my_value}).end();
                    logger.info("athlete '" + req.user.Identificator + "' got activities page");
                }
            });
        }
    });
});

//
router.get('/value/:activity_id', auth().authenticate(), function (req, res) {
    valueManager.getAuthorLikeValues(req.params.activity_id, function(err, like_values) {
        if(err) {
            res.json({success: false, error: err.message}).end();
            logger.warn("athlete '"+req.user.Identificator+"' getting values list ERROR: "+err.message);
        } else {
            res.json({success: true, values: like_values}).end();
            logger.info("athlete '"+req.user.Identificator+"' got values of activity (ID="+req.params.activity_id+")");
        }
    });
});

module.exports = router;
