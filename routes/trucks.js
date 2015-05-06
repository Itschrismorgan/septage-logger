var express = require('express');
var router = express.Router();
var truck = require('../server/controllers/truck');
var user = require('../server/controllers/user');
var company = require('../server/controllers/company');


router.get('/', function(req,res,next){
    if (req.user.type === 'admin' || req.user.type === 'contractor' || req.user.type === 'driver'){
        truck.getTruckList(req,res);
    } else {
        res.status(401).json({code: 401, message: 'not authorized to create truck records'});
    }
});

router.get('/:truck_id', function(req,res,next){
    if (req.user) {
        truck.getTruck(req,res);
    } else {
        res.status(401).json({code: 401, message: 'not authorized'});
    }
});

router.post('/', function(req,res,next){
    console.log(req.body);
    if (req.user.type === 'admin' || (req.user.type === 'contractor' || req.user.company === req.body.companyName)){
        truck.createTruck(req,res);
    }
});

router.delete('/:truck_id', function(req,res,next){
    if (req.user.type === 'admin' || (req.user.type === 'contractor' || req.user.company === req.body.companyName)){
        truck.deleteTruck(req,res);

    }
});

router.post('/:truck_id', function(req,res,next){
    if (req.user.type === 'admin' || (req.user.type === 'contractor' || req.user.company === req.body.companyName)){
        truck.updateTruck(req,res);
    }
});


module.exports = router;


