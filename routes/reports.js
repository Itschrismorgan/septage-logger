/* 
  Router for Reports
*/

var express = require('express');
var router = express.Router();
var reports = require('../server/controllers/reports');

router.get('/', function(req,res,next){
    console.log('in reports get');
    //console.log(req.user);
    if (req.user || req.user.type === "admin" || req.user.type === "contractor"){
        //console.log("test it");
        reports.listTrucksAndCollections(req.user, null, res);/*{
            //console.log("did this work?");
           if(err){
                console.log(err);
                res.status(err.code).json(err.message);
                return;
            }

            res.status(200).json(data); 
        });*/
    } else {
        res.status(401).json({code: 401, message: 'You are not authorized to access this resource'});
    }
});

router.get('/collection-history', function(req,res,next){
    var beginDate = null;
    if(req.query.beginDate){
        console.log('qp: '+req.query.beginDate);
        beginDate = req.query.beginDate;
    } else {
        beginDate = new Date(new Date().setDate(new Date().getDate()-30));
    }
    //console.log(req.user);
    if (req.user || req.user.type === "admin" || req.user.type === "contractor"){
        //console.log("test it");
        reports.listTrucksAndCollections(req.user, beginDate, res);/*{
         //console.log("did this work?");
         if(err){
         console.log(err);
         res.status(err.code).json(err.message);
         return;
         }

         res.status(200).json(data);
         });*/
    } else {
        res.status(401).json({code: 401, message: 'You are not authorized to access this resource'});
    }
});

router.get('/spreadsite-history', function(req,res,next){
    var beginDate = null;
    if(req.query.beginDate){
        console.log('qp: '+req.query.beginDate);
        beginDate = req.query.beginDate;
    } else {
        beginDate = new Date(new Date().setDate(new Date().getDate()-30));
    }
    //console.log(req.user);
    if (req.user || req.user.type === "admin" || req.user.type === "contractor"){
        //console.log("test it");
        reports.listSpreadsiteData(req.user, beginDate, res);/*{
         //console.log("did this work?");
         if(err){
         console.log(err);
         res.status(err.code).json(err.message);
         return;
         }

         res.status(200).json(data);
         });*/
    } else {
        res.status(401).json({code: 401, message: 'You are not authorized to access this resource'});
    }
});

module.exports = router;