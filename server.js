var express = require('express');
var app = express();

app.get('/long', function (req, res) {
    setTimeout(function() {res.send({res:'returned after 5 seconds'})},5000)

});

app.get('/short', function (req, res) {
    setTimeout(function() {res.send({res:'returned after 2 seconds'})},2000)
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
