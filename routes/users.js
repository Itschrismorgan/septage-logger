var express = require('express');
var router = express.Router();
var user = require('../server/controllers/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next){
    if(req.user.type === "admin"){
        user.createUser(req,res);
    } else {
        res.status(401).json({code: 401, message: 'not authorized to create users'});
    }
});

router.get('/:username', function(req,res,next){
    //console.log(req.user);
    if(req.user._id === req.params.username || req.user.type === "admin"){
        // user can get info on themselves or admin can see all users
        user.getUser(req,res);
    } else {
        res.status(401).json({code: 401, message: 'not authorized for requested info'});        
    }
});

router.delete('/:username', function(req, res, next){
    user.deleteUser(req,res);
})

module.exports = router;
