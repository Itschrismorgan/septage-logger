var express = require('express');
var router = express.Router();
//var trucks = require('../server/controllers/trucks');


router.get('/', function(req,res,next){
    res.send("check");
});

router.get('/:truck_id', function(req,res,next){
    res.send("get for truck:"+req.params.truck_id);
});

router.post('/', function(req,res,next){
    console.log(req.body);
    res.send("check post");
});

router.delete('/:truck_id', function(req,res,next){
    res.send("check delete:"+req.params.truck_id);
});

router.post('/:truck_id', function(req,res,next){
    res.send("check update:"+req.params.truck_id);
});


module.exports = router;