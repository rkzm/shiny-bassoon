(function () {

  "use strict";
  var express, bodyparser, port, server, bookrouter, app;

  express = require('express');
  bookrouter = express.Router();
  bodyparser = require('body-parser');
  app = express();
  port = process.env.PORT || 8080;

    
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  
  app.get('/', function (req, res) {
    var jsobject = [{
        "title": "Kilimanjaro",
        "greeting": "Hello world",
        "genre": "Drama",
        "author": "Makena",
        "read": false
      },
      {
        "title": "Kilimanjaro",
        "greeting": "Hello world",
        "genre": "Drama",
        "author": "Makena",
        "read": false
      }];
    
    res.json(jsobject);
  });

  server = app.listen(port, function () {
    console.log('App is running my server on PORT: ' + port);
  });

  module.exports = server;

} ());