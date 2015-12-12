var express = require('express')
var fs = require('fs')
var tls = require('tls')





var sslOptions = {
        key: fs.readFileSync('public/server.key'),
        cert: fs.readFileSync('public/server.crt')
};
tls.createServer(sslOptions, function (cleartextStream) {
    var cleartextRequest = net.connect({
        port: port,
        host: serverStr
    }, function () {
        cleartextStream.pipe(cleartextRequest);
        cleartextRequest.pipe(cleartextStream);
    });
}).listen(443);
