
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

module.exports = router;
