
  var express, bodyparser, port, server, bookrouter, app, Book, db, mongoose, url;

  express = require('express');
  Book = require('./models/bookmodel');
  bookrouter = require('./routes/bookroutes')(Book);
  bodyparser = require('body-parser');
  app = express();
  port = process.env.PORT || 8080;
  mongoose = require('mongoose');
  url = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':27017/dockerdemo';
  // mongoose.connect(url, function (err, database) {
  //   console.log("Connected correctly to server");
  //   db = database;
  // });
  db = mongoose.connect('nashamongo');
  // db = mongoose.connect(url);
    
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  
  app.use('/api/books', bookrouter);

  server = app.listen(port, function () {
    console.log('App is running my server on PORT: ' + port);
  });

  module.exports = server;


//docker run  -p external:Internal -v $(pwd):"/var/www/" -w "/var/www/" node npm start
//this will create a working environment running in a container
