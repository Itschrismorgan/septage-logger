var express = require('express');
var router = express.Router();
var user = require('../server/controllers/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next){
    user.createUser(req,res);
});

router.get('/:username', function(req,res,next){
    console.log(req.user);
    user.getUser(req,res);
});

router.delete('/:username', function(req, res, next){
    user.deleteUser(req,res);
})

module.exports = router;
