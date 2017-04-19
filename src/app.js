var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var opn = require('opn');
var fs = require("fs");
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname));
app.use(favicon(__dirname + '/favicon.ico'));

app.get("/api/users/", (request, response) => {
  fs.readFile(__dirname + '/data/users.json', 'utf8', function (error, data) {
    if(error) {
      return console.error("Error reading file: " + error);
    }
    response.json(JSON.parse(data));
  });
});

app.get("/api/gifts/", (request, response) => {
  fs.readFile(__dirname + '/data/gifts.json', 'utf8', function (error, data) {
    if(error) {
      return console.error("Error reading file: " + error);
    }
    response.json(JSON.parse(data));
  });
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
});

app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
  opn('http://localhost:3000');
});

module.exports = app;