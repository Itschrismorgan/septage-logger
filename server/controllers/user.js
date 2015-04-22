var mongoose = require('mongoose');
var crypto = require('crypto');
var user = mongoose.model('User');





exports.createUser = function(req,res){
    //console.log("in controller:createUser");
    var salt = genSalt();
    //console.log(req.body);
    var passwordHash = hash(req.body.password, salt);
    
    var userToCreate = {
        _id: req.body.username,
        passwordHash: passwordHash,
        salt: salt,
        type: req.body.type,
        email: req.body.email,
        active: true
    };
    
    
    //console.log(userToCreate);
    user.create(userToCreate, function(err){
        if(err){
            //user creation failed
            console.log("failed to create user");
            console.log(err);
            res.status(500).json({code: 500, message: "Failed to create user"});
        }
        
        console.log(userToCreate._id+" created.");
        res.status(200).json({username: userToCreate._id});
    });
};

exports.getUser = function(req,res){
    
    user.findOne({_id: req.params.username}, function(err, user){
        if(err){
            res.status(500).json({code:500, message: "GetUser: Server error"});
        }
        
        if(!user){
            res.status(404).json({code:404, message: "user not found"});
        } else {
            res.status(200).json(safeUserInfo(user));
        }
    });
    
    
};

exports.updateUser = function(req,res){
    user.findByIdAndUpdate(req.params.username, req.body , function(err, userRet){
        if(err){
            res.status(500).json({code:500, message: "error updating user", error: err});
        }
        
        console.log(userRet);
        user.findOne({_id: userRet._id}, function(err,updateUser){
            if(err){
                res.status(500).json({code:500, message: "GetUser: Server error"});
            }
            
            if(!user){
                res.status(404).json({code:404, message: "user not found"});
            } else {
                res.status(200).json(safeUserInfo(updateUser));
            }
        });
    });
};

exports.getUserList = function(req,res){
    user.find({}, '_id type email active', function(err, users){
        if(err) {
            res.status(500).json({code: 500, message: "failed to delete user"});
        }
        
        if(!users){
            res.status(404).json({code: 404, message: "no users found"})
        } else {
            res.status(200).json(users);
        }
    });  
};


exports.deleteUser = function(req,res){
    user.findOne({_id: req.params.username }, function(err, user){
        if(err) {
            res.status(500).json({code: 500, message: "failed to delete user"});
        }
        
        if(!user){
            res.status(404).json({code: 404, message: "user not found"})
        } else {
            user.remove({_id: req.params.username}, function(err){
                if(err) {
                    res.status(500).json({code: 500, message: "failed to delete user"});
                }
            
                res.status(200).json({code: 200, message: req.params.username+" deleted"});
            });
        }
    });
};


exports.checkCredentials = function(userToCheck, password){
        
    var passwordHash = hash(password, userToCheck.salt);
    if(passwordHash === userToCheck.passwordHash){
        return true;
    } else {
        return false;
    }
};

var safeUserInfo = function(user){
    var cleanedUser = {};
    
    cleanedUser.username = user._id;
    cleanedUser.email = user.email;
    cleanedUser.active = user.active;
    cleanedUser.type = user.type;

    return cleanedUser;
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