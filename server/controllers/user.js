var mongoose = require('mongoose');
var crypto = require('crypto');
var user = mongoose.model('User');


exports.createUser = function(req,res){
    var salt = genSalt();
    var passwordHash = hash(req.body.password, salt);
    
    var userToCreate = {
        _id: req.body.username,
        passwordHash: passwordHash,
        salt: salt,
        type: req.body.userType,
        email: req.body.email,
        active: true
    };
    
    user.create(userToCreate, function(err){
        if(err){
            //user creation failed
            
        }
        
        // user created
    });
};

exports.viewUser = function(req,res){
    
    
};

exports.updateUser = function(req,res){
    
    
};


var hash = function(pass, salt) {
    var hash = crypto.createHash('sha512');
    hash.update(pass, 'utf8');
    hash.update(salt, 'utf8');
    return hash.digest('base64');
};


var genSalt = function(){
    var salt = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&!@#$%^&*()<>?{}[]|.,";

    for( var i=0; i < 5; i++ )
        salt += possible.charAt(Math.floor(Math.random() * possible.length));

    return salt;
};