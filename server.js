(function () {

  "use strict";

  var express, bodyparser, port, server;

  express = require('express');
  
  bodyparser = require('body-parser');

  port = process.env.PORT || 8080;

  var app = express();

  app.use(bodyparser.urlencoded({ extended: true }));

  app.use(bodyparser.json());

  app.get('/', function (req, res) {
    var jsobject = {"greeting":"Hello world"};
    res.json(jsobject);
  });

  server = app.listen(port, function () {
    console.log('App is running my server on PORT: ' + port);
  });

  module.exports = server;

} ());