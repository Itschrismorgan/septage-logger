/**
 * Created by chrismorgan on 5/26/15.
 */

var express = require('express');
var router = express.Router();
var spreadSites = require('../server/controllers/spreadsite');

router.get('/', function(req,res,next){
    console.log("in get list route");
    if(req.user || req.user.type === "admin" || req.user.type === "contractor" || req.user.type === "driver"){
        spreadSites.listSpreadSites(req.user, function(err, data){
            if(err){
                console.log(err);
                res.status(err.code).json(err.message);
                return;
            }

            res.status(200).json(data);
        });
    } else {
        res.status(401).json({code: 401, message: 'You are not authorized to access this resource'});
    }
});

router.get('/:spreadsite_id', function(req,res,next){
    console.log("in get single rec route");
    if(req.user.type === "admin" || req.user.type === "contractor" || req.user.type === "driver"){
        spreadSites.getSpreadSite(req.params.spreadsite_id, req.user, function(err, data){
            if (err){
                console.log(err);
                res.status(err.code).json(err.message);
                return;
            }

            res.status(200).json(data);
        });
    } else {
        res.status(401).json({code: 401, message: 'You are not authorized to access this resource'});
    }
});

router.post('/', function(req,res,next){
    console.log("in create route");
    if(req.user || req.user.type === "admin"){
        spreadSites.createSpreadSite(req.body, req.user, function(err, data){
            if (err){
                console.log(err);
                res.status(err.code).json(err.message);
                return;
            }

            res.status(200).json(data);
        });
    } else {
        res.status(401).json({code: 401, message: 'You are not authorized to access this resource'});
    }
});

router.post('/:spreadsite_id', function(req,res,next){
    if(req.user.type === "admin"){
        spreadSites.updateSpreadSite(req.params.spreadsite_id, req.body, function(err, data){
            if (err){
                console.log(err);
                res.status(err.code).json(err.message);
                return;
            }

            res.status(200).json(data);
        });
    } else {
        res.status(401).json({code: 401, message: 'You are not authorized to access this resource'});
    }
});

router.delete('/:spreadsite_id', function(req,res,next){
    if(req.user.type === "admin"){
        spreadSites.deleteSpreadSite(req.params.spreadsite_id, function(err, data){
            if(err){
                console.log(err);
                res.status(err.code).json(err.messsage);
                return;
            }

            res.status(200).json(data);
        });
        res.status(200).json({code: 200, message: 'test delete collection'});
    } else {
        res.status(401).json({code: 401, message: 'You are not authorized to delete this resource'});
    }
});

module.exports = router;