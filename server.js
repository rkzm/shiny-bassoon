
  var express, bodyparser, port, server, bookrouter, app, Book, db, mongoose;

  express = require('express');
  Book = require('./models/bookmodel');
  bookrouter = require('./routes/bookroutes')(Book);
  bodyparser = require('body-parser');
  app = express();
  port = process.env.PORT || 8080;
  mongoose = require('mongoose');
  db = mongoose.connect('mongodb://localhost/bookapi');
    
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  
  app.use('/api/books', bookrouter);

  server = app.listen(port, function () {
    console.log('App is running my server on PORT: ' + port);
  });

  module.exports = server;
