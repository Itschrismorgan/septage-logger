var mongoose = require('mongoose');
var crypto = require('crypto');
var user = mongoose.model('User');
var company = mongoose.model('Company');


exports.getUserType = function(username){
    user.findOne({_id: username}, function(err, user){
        if(err){
        return "";
        }
        
        if(!user){
            return "";
        } else {
            return user.type;
        }
    });
};


exports.createUser = function(req,res){
    //console.log("in controller:createUser");
    
    company.findOne({name: req.body.company}, function(err, company){
        if(err){
            res.status(500).json({code:500, message: "Server error retrieving company record"});
        }

        if(!company){
            res.status(404).json({code:404, message: "company record not found"});
        } else {
            if(req.user.type === 'contractor' && req.body.type !== 'driver'){
                res.status(400).json({code: 400, message: "Not authorized to create this kind of account"});
                return;
            }
            var salt = genSalt();
            //console.log(req.user);
            var passwordHash = hash(req.body.password, salt);

            var userToCreate = {
                _id: req.body.username,
                passwordHash: passwordHash,
                salt: salt,
                type: req.body.type,
                companyId: company._id,
                email: req.body.email,
                active: true
            };
            //console.log(userToCreate);
            user.create(userToCreate, function(err){
                if(err){
                    //user creation failed
                    console.log("failed to create user");
                    //console.log(err);
                    res.status(500).json({code: 500, message: "Failed to create user", err: err});
                }

                console.log(userToCreate._id+" created.");
                res.status(200).json({username: userToCreate._id});
            });
        }
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
            company.findOne({_id: user.companyId}, function(err, company){
                if (err){
                    res.status(500).json({code:500, message: "Get company: server error"});
                }
                user.company = company;
                res.status(200).json(safeUserInfo(user, company));
            })
        }
    });
};

exports.updateUser = function(req,res){
    console.log("in controller user:updateUser");
    console.log(req.body);
    company.findOne({name: req.body.company},function(err, company){
        if(err){
            res.status(500).json({code:500, message: "Server error retrieving company record"});
        } else {
            if(!company){
                res.status(404).json({code:404, message: "company record not found"});
            } else {
                console.log("in updateUser");
                console.log(req.body);
                var userToUpdate = req.body;
                userToUpdate.companyId = company._id;
                console.log(userToUpdate);
                user.findByIdAndUpdate(req.params.username, userToUpdate , function(err, userRet){
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
            }
        }
    });
};

exports.getUserList = function(req,res){
    if(req.user.type === "admin"){
        user.find({}, '_id type email companyId active', function(err, users){
            if(err) {
                res.status(500).json({code: 500, message: "failed to delete user"});
            }
            
            if(!users){
                res.status(404).json({code: 404, message: "no users found"})
            } else {
                res.status(200).json(users);
            }
        });  
    } else {
        //console.log(req.user);
        getUserCompany(req.user._id, function(limitToCompany){
            user.find({companyId: limitToCompany}, function(err, users){
                //console.log(users);
                if(err) {
                    res.status(500).json({code: 500, message: "failed to delete user"});
                }
                
                if(!users){
                    res.status(404).json({code: 404, message: "no users found"})
                } else {
                    res.status(200).json(users);
                }
            });
        });
    }
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
    //console.log(passwordHash, userToCheck.passwordHash);
    if(passwordHash === userToCheck.passwordHash){
        return true;
    } else {
        return false;
    }
};

exports.getUserType = function(username){
    user.findOne({_id: username}, function(err, user){
        if(err){
        return "";
        }
        
        if(!user){
            return "";
        } else {
            return user.type;
        }
    });
};

var getUserCompany = function(username, callback){
    user.findOne({_id: username}, function(err, data){
        if(err){
            console.log(err);
            return null;
        }
        console.log("in getUserCompany");
        console.log(data);
        callback(data.companyId);
    });
};

var safeUserInfo = function(user, company){
    var cleanedUser = {};

    cleanedUser.username = user._id;
    cleanedUser.email = user.email;
    cleanedUser.active = user.active;
    cleanedUser.type = user.type;
    if(company){
        cleanedUser.company = company.name;
    }

    console.log(cleanedUser)
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
