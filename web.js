var express = require('express');
var http = require('http');
var fs = require('fs');

var app = express.createServer(express.logger());

aidForYearCache = new Array();

function serveFile(path, mimeType, response) {
    fs.readFile(path, function (error, content) {
        if (error) {
            response.writeHead(500);
            response.end();
        }
        else {
            response.writeHead(200, { 'Content-Type': mimeType });
            response.end(content, 'utf-8');
        }
    });
}
function getAidForYear(year, onResult) {
    var options = {
        host: 'api.openaid.se', //putting http:// here causes node to explode
        port: 80,
        path: '/api/v1/country?year=' + year,
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
            aidForYearCache[year] = jsonData;
            onResult(jsonData)
        });
    }).end();
}
app.get('/country/:year', function (request, response) {
    var year = parseInt(request.params.year, 10);
    function sendResult (data) {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(data), 'utf-8');
    }
    if (aidForYearCache[year]) {
        sendResult(aidForYearCache[year]);
    } else {
        getAidForYear(year, sendResult);
    }
    
});
app.get('/', function (request, response) {
    serveFile('./index.html', 'text/html', response);
});
app.get('/client.js', function (request, response) {
    serveFile('./client.js', 'text/javascript', response);
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});