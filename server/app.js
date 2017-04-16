var express = require("express");
var fs = require("fs");

var app = express();
var port = 3000;
app.set("port", port);

app.get("/api/users/", function(request, response) {
  fs.readFile('./data/users.json', 'utf8', function (error, data) {
    if(error) {
      return console.error("Error reading file: " + error);
    }
    response.json(JSON.parse(data));
  });
});

app.get("/api/gifts/", function(request, response) {
  fs.readFile('./data/gifts.json', 'utf8', function (error, data) {
    if(error) {
      return console.error("Error reading file: " + error);
    }
    response.json(JSON.parse(data));
  });
});

app.listen("3000", function() {
  console.log("listening on 3000");
});