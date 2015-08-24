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
    var endDate = null;
    var siteId = null;
    if(req.query.dates.beginDate){
        console.log('qp: '+req.query.dates.beginDate);
        beginDate = req.query.dates.beginDate;
    } else {
        beginDate = new Date(new Date().setDate(new Date().getDate()-30));
    }
    if(req.query.dates.endDate){
        console.log('qp: '+req.query.dates.endDate);
        endDate = req.query.dates.endDate;
    } else {
        endDate = new Date();
    }
    if(req.query.dates.siteId){
        siteId = req.query.dates.siteId;
    }
    //console.log(req.user);
    if (req.user || req.user.type === "admin" || req.user.type === "contractor"){
        //console.log("test it");
        reports.listTrucksAndCollections(req.user, beginDate, endDate, siteId, res);/*{
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
    var year = null;
    var spreadsite = null;
    if(req.query.dates.year){
        //console.log('qp: '+req.query.dates.year);
        year = req.query.dates.year;
    } else {
        year = new Date().getFullYear();
    }
    if(req.query.dates.spreadsite){
        //console.log('qp: '+req.query.dates.spreadsite);
        spreadsite = req.query.dates.spreadsite;
    } else {
        spreadsite = null;
    }
    //console.log(req.user);
    if (req.user || req.user.type === "admin" || req.user.type === "contractor"){
        //console.log("test it");
        reports.listSpreadsiteData(req.user, year, spreadsite, function(err, data){
            if(err){
            console.log(err);
            res.status(err.code).json(err.message);
            return;
            }

            res.status(200).json(data);
        });/*{
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