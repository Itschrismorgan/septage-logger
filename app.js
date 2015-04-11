var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var app = express();

// view engine setup
app.engine('html',swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.set('view cache', false);
swig.setDefaults({cache: false});

passport.use(new LocalStrategy(
    function(username, password, done){
      
      console.log(username, password);
      /*User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }*/
        var user = { username: "me", email: "me@me.com", validPassword: function(password){return false;}}
        console.log(user);
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      //});
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  var user = { username: "me", email: "me@me.com", validPassword: function(password){return true;}}
  var err = null;
  //User.findById(id, function(err, user) {
    done(err, user);
  //});
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


require('./server/models');


// TODO: possibly move to external file
var routes = require('./routes/index');
var users = require('./routes/users');
app.use('/', routes);
app.use('/users', users);

app.post('/login', function(req, res, next) {

  passport.authenticate('local', function(err, user, info) {
    console.log("check", err, "--", user, "--", info);
    if (err) {console.log("top err"); return next(err)}
    if (!user) {
      req.session.messages =  [info.message];
      return res.redirect('http://www.google.com')
    }
    req.logIn(user, function(err) {
      console.log("in logIn callback");
      console.log(err);
      if (err) { return next(err); }
      return res.redirect('http://www.twitter.com');
    });
  })(req, res, next);
});



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


module.exports = app;
