var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
//add socket.io
app.io = require('socket.io')();

// connect to mongodb
var mongoose = require('mongoose');

// config file
var config = require('./config/globalVars');
mongoose.connect(config.db);

var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var localStrategy = require('passport-local').Strategy;

// enable the ap to use these pasport classes
app.use(flash());

// configure sessions
app.use(session( {
	secret: config.secret,
	resave: true,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// connect passport to the Account model to talk to mongodb
var Account = require('./models/account');
passport.use(Account.createStrategy())

// manage sessions through the db
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/* Listen for Socket.io events */
app.io.on('connection', function(socket) {
  //do things here when a user connects
  console.log('a user connected');
  app.io.emit('conn');
  //updates the user count and user list
  app.io.emit('update-count', Object.keys(app.io.sockets.connected).length);
  app.io.emit("update-people", Object.keys(app.io.sockets.connected));

  //do things here when a user disconnects
  socket.on('disconnect', function() {
    console.log('a user disconnected');
    app.io.emit('disconn');
    //updates the user count and user list
    app.io.emit('update-count', Object.keys(app.io.sockets.connected).length);
    app.io.emit("update-people", Object.keys(app.io.sockets.connected));
  });

  //do things here when a message is sent
  socket.on('new message', function(msg) {
    console.log('new message: ' + msg);
    app.io.emit('chat message', msg);
  });
});

//catch 404 and forward to error handler
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


module.exports = app;
