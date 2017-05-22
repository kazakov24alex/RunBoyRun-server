
// ========================================
// Router for activity API
// ========================================


var express = require('express');
var router = express.Router();

var commentManager = require('../libs/managers/comment_manager');

var logger = require('../libs/logger')(module);
var config = require('../config');
var auth   = require('../libs/auth');


// Addition of new athlete's comment
router.post('/comment', auth().authenticate(), function (req, res) {
    commentManager.addComment(req.user.Identificator, req.body, function (err, comment_id) {
        if(err) {
            res.json({success: false, error: err.message}).end();
            logger.warn("athlete '"+req.user.Identificator+"' addition comment ERROR: "+err.message);
        } else {
            res.json({success: true, comment_id: comment_id}).end();
            logger.info("athlete '"+req.user.Identificator+"' added comment (ID="+comment_id+")");
        }
    });
});


// Getting all comments of activity
router.get('/comment/:activity_id', auth().authenticate(), function (req, res) {
   commentManager.getComments(req.params.activity_id, null, function (err, comments) {
       if(err) {
           res.json({success: false, error: err.message}).end();
           logger.warn("athlete '"+req.user.Identificator+"' getting comments ERROR: "+err.message);
       } else {
           res.json({success: true, comments: comments}).end();
           logger.info("athlete '"+req.user.Identificator+"' got comments of activity (ID="+req.params.activity_id+")");
       }
   });
});


// Getting several comments of activity
router.get('/comment/:activity_id/:num', auth().authenticate(), function (req, res) {
   commentManager.getComments(req.params.activity_id, req.params.num, function (err, comments) {
       if(err) {
           res.json({success: false, error: err.message}).end();
           logger.warn("athlete '"+req.user.Identificator+"' getting preview comments ERROR: "+err.message);
       } else {
           res.json({success: true, comments: comments}).end();
           logger.info("athlete '"+req.user.Identificator+"' got preview comments of activity (ID="+req.params.activity_id+")");
       }
   });
});

module.exports = router;
