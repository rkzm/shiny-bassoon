  var express, bodyparser, port, server, bookrouter,
      app, Book, mongoose, url, connection_string, accessLogStream,
      fs, morgan, path, db;

  fs = require('fs');
  morgan = require('morgan');
  path = require('path');
  express = require('express');
  db = require('./lib/database');
  Book = require('./models/bookmodel');
  bookrouter = require('./routes/bookroutes')(Book);
  bodyparser = require('body-parser');
  mongoose = require('mongoose');

  app = express();
  port = process.env.PORT || 3000;

  // create a write stream (in append mode)
  accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  app.use('/api/books', bookrouter);
  // setup the logger
  app.use(morgan('combined', {stream: accessLogStream}));

  server = app.listen(port, function () {
    console.log('App is running my server on PORT: ' + port);
  });

  module.exports = server;


