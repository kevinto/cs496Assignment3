var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.disable('etag');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Set up Redis
// if (process.env.REDISTOGO_URL) {
//   var rtg   = require("url").parse(process.env.REDISTOGO_URL);
//   GLOBAL.redis = require("redis").createClient(rtg.port, rtg.hostname);

//   GLOBAL.redis.auth(rtg.auth.split(":")[1]);
  
//   console.log("Successful init of redis");
// }
// else {
  // console.log("Running redis in development");
  // GLOBAL.redis = require("redis").createClient();
// }

// Set up mongodb
// var mongoose = require('mongoose');
// var uriUtil = require('mongodb-uri');
// var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
//                 replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };  
// if (process.env.MONGOLAB_URI) {
//   var rtg   = require("url").parse(process.env.MONGOLAB_URI);
//   GLOBAL.redis = require("redis").createClient(rtg.port, rtg.hostname);

//   GLOBAL.redis.auth(rtg.auth.split(":")[1]);
  
//   console.log("Successful init of redis");
// }
// else {
//   console.log("Running redis in development");
//   GLOBAL.redis = require("redis").createClient();
// }


// Set up MongoDb
module.exports = app;
