
// ========================================
// Logging module
// ========================================

var winston = require('winston');


function getLogger(module) {

    // a label with the name of the file that displays the message
    var path = module.filename.split('/').slice(-2).join('/');

    // date display format
    var tsFormat = function () {
        return (new Date()).toLocaleDateString('en-GB')+' '+(new Date()).toLocaleTimeString('en-GB');
    };

    // Create logger
    return  new winston.Logger({
        // Transports for logs
        transports : [
            new winston.transports.Console({
                colorize: true,
                level: 'debug',
                timestamp: tsFormat,
                label: path
            })
        ]
    });
}


module.exports = getLogger;
