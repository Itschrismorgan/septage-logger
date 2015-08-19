/*
File that contains help functions for passport interaction.
*/

var mongoose = require('mongoose');
var user = mongoose.model('User');
var userCtrl = require("../controllers/user");
var passport = require('passport');

exports.localHandler = function(username, password, done){
    //console.log(username, password);
    user.findOne({_id: username}, function(err, user){
        //console.log(user);
        if (err) { return done(err); }
        
        //console.log("no err");
        if(!user) {
            console.log("nouser");
            return done(null, false, { code: 404, message: 'Incorrect username.'});
        }
        
        if (!userCtrl.checkCredentials(user, password)){
            console.log("bad pass");
            return done(null, false, { code: 401, message: 'Incorrect password.' });
        }
        
        return done(null, user);
    });
};


passport.serializeUser(function(user, done) {
  //console.log("serialize");
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  //console.log("deserialize");
  user.findById(id, function(err, user) {
      //console.log(user);
      done(err, user);
  });
});