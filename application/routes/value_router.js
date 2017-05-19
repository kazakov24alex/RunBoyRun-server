
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
            res.json({success: true, value_id: value_id}).end();
            logger.info("athlete '"+req.user.Identificator+"' change value of activity (ID="+body.activity_id+")");
        }
    });
});

module.exports = router;
