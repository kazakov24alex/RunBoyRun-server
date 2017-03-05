/**
 * Created by alex on 05.03.17.
 */

var http = require('http');

var server = new http.Server();  // EventEmitter

server.listen(1337, '127.0.0.1');

server.on('request', function(req,res) {
    res.end('RunBoyRun server. Welcome!');
});

