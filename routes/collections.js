/**
 * Created by chrismorgan on 5/18/15.
 */
var express = require('express');
var router = express.Router();
var collections = require('../server/controllers/collections');

router.get('/', function(req,res,next){
    console.log("in get list route");
    var inprocess = false;
    if(req.query.inprocess){
        inprocess = true;
    }
    if(req.user || req.user.type === "admin" || req.user.type === "contractor" || req.user.type === "driver"){
        collections.listCollections(inprocess, function(err, data){
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

router.get('/:collection_id', function(req,res,next){
    console.log("in get single rec route");
    if(req.user.type === "admin" || req.user.type === "contractor" || req.user.type === "driver"){
        collections.getCollection(req.params.collection_id, function(err, data){
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
    if(req.user || req.user.type === "admin" || req.user.type === "contractor" || req.user.type === "driver"){
        collections.createCollection(req.body, req.user, function(err, data){
            console.log('in callback');
            console.log(err);
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
        collections.updateCollection(req.params.collection_id, req.body, function(err, data){
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

router.delete('/:collection_id', function(req,res,next){
    if(req.user.type === "admin"){
        collections.deleteCollection(req.params.collection_id, function(err, data){
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