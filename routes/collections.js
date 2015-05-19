/**
 * Created by chrismorgan on 5/18/15.
 */
var express = require('express');
var router = express.Router();
var collections = require('../server/controllers/collections');

router.get('/', function(req,res,next){
    console.log("in get list route");
    if(req.user || req.user.type === "admin" || req.user.type === "contractor" || req.user.type === "driver"){
        res.status(200).json({code: 200, message: 'test record list'});
    } else {
        res.status(401).json({code: 401, message: 'You are not authorized to access this resource'});
    }
});

router.get('/:collection_id', function(req,res,next){
    console.log("in get single rec route");
    if(req.user.type === "admin" || req.user.type === "contractor" || req.user.type === "driver"){

    } else {
        res.status(401).json({code: 401, message: 'You are not authorized to access this resource'});
    }
});

router.post('/', function(req,res,next){
    console.log("in create route");
    if(req.user || req.user.type === "admin" || req.user.type === "contractor" || req.user.type === "driver"){
        collections.createCollection(req.body, function(err, data){
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

router.post('/:collection_id', function(req,res,next){
    if(req.user.type === "admin" || req.user.type === "contractor" || req.user.type === "driver"){
        res.status(200).json({code: 200, message: 'test update record'});
    } else {
        res.status(401).json({code: 401, message: 'You are not authorized to access this resource'});
    }
});

router.delete('/:collection_id', function(req,res,next){
    if(req.user.type === "admin" || req.user.type === "contractor" || req.user.type === "driver"){
        res.status(200).json({code: 200, message: 'test delete collection'});
    } else {
        res.status(401).json({code: 401, message: 'You are not authorized to access this resource'});
    }
});

module.exports = router;