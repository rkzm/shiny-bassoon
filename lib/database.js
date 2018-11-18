var mongoose, chalk, connection_string, connected, error, disconnected, termination;

//require mongoose module
mongoose = require('mongoose');

//require chalk module to give colors to console text
chalk = require('chalk');

//require database URL from properties file
connection_string = process.env.MONGODB_URI || 'mongodb://localhost/bookapi';;

connected = chalk.bold.cyan;
error = chalk.bold.yellow;
disconnected = chalk.bold.red;
termination = chalk.bold.magenta;

//export this function and imported by server.js
module.exports = function(){

    mongoose.connect(connection_string);

    mongoose.connection.on('connected', function(){
        console.log(connected("Mongoose default connection is open to ", connection_string));
    });

    mongoose.connection.on('error', function(err){
        console.log(error("Mongoose default connection has occured "+err+" error"));
    });

    mongoose.connection.on('disconnected', function(){
        console.log(disconnected("Mongoose default connection is disconnected"));
    });

    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log(termination("Mongoose default connection is disconnected due to application termination"));
            process.exit(0)
        });
    });
}
