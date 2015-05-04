var mongoose = require('mongoose');
var crypto = require('crypto');

require('../server/models');

var user = mongoose.model('User');



var username = process.argv[2];
var password = process.argv[3];
var email = process.argv[4];

//console.log(username);
//console.log(password);

var salt = genSalt();
var passwordHash = hash(password, salt);
    
var userToCreate = {
    _id: username,
    passwordHash: passwordHash,
    salt: salt,
    type: 'admin',
    email: email,
    active: true
};

console.log(userToCreate);
mongoose.connect('mongodb://localhost/septage', function(err){

    if(err){
        console.log("Error connecting to MongoDB!");
        throw(err);
    }
    console.log("connected to DB.");
    
    //console.log(user);
    user.find({}, '_id', function(err,users){
        if(err){
            console.log("Error!!!!");
        };
        
        if (users){
            console.log("users exist - do not allow user creation");
            mongoose.connection.close();
        } else {
            console.log("no users exist - creating seed user");
            user.create(userToCreate, function(err){
                if(err){
                    //user creation failed
                    console.log("failed to create user");
                    console.log(err);
                }
                console.log(userToCreate._id+" created.");
                mongoose.connection.close();
            });
        }
    });
});



function hash(pass, salt) {
    var hash = crypto.createHash('sha512');
    hash.update(pass, 'utf8');
    hash.update(salt, 'utf8');
    return hash.digest('base64');
};


function genSalt(){
    var salt = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&!@#$%^&*()<>?{}[]|.,";

    for( var i=0; i < 5; i++ )
        salt += possible.charAt(Math.floor(Math.random() * possible.length));

    return salt;
};