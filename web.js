var express = require('express');
var http = require('http');
var fs = require('fs');

var app = express.createServer(express.logger());

app.get('/country/:year', function (request, response) {
    var options = {
        host: 'api.openaid.se', //putting http:// here causes node to explode
        port: 80,
        path: '/api/v1/country?year=' + parseInt(request.params.year, 10),
        method: 'GET'
    };
    var chunks = [];
    http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
        res.on('end', function () {
            var jsonData = JSON.parse(chunks.join(''));
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(jsonData), 'utf-8');
        });
    }).end();
});
app.get('/', function (request, response) {
    fs.readFile('./index.html', function (error, content) {
        if (error) {
            response.writeHead(500);
            response.end();
        }
        else {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(content, 'utf-8');
        }
    });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});