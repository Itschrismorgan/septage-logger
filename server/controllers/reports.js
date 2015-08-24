/* 
  Controller for Reports
*/
var mongoose = require('mongoose');

var spreadsite = mongoose.model('SpreadSite');
var company = mongoose.model('Company');
var collection = mongoose.model('Collection');

exports.listTrucksAndCollections = function(user, beginDate, endDate, siteId, res){
    //console.log("in get Collections list for report");
    //console.log(user);
    var query = {};
    if(user.type === 'contractor'){
        query = {companyId: user.companyId.toString()};
    }
    if(beginDate){
        //console.log(beginDate);
        var qDate = new Date(beginDate).toISOString();
        query.createdTimeStamp = {"$gte":  new Date(qDate)};
    }
    if(endDate){
        var qeDate = new Date(endDate).toISOString();
        query.createdTimeStamp.$lte = new Date(qeDate);
    }
    if(siteId){
        query.spreadSiteId = siteId;
    }
    //console.log(query);
    collection.find(query, function(err, collections){
        if(err){
            console.log(err);
            res.status(500).json({code:500, message: "GetUser: Server error"});
            return;
        }
        
        var modCollections = [];
        //console.log(collections.length);
        collections.forEach(function (element, index){
            var modCollection = {};
            modCollection._id = collections[index]._id;
            modCollection.companyId = collections[index].companyId;
            modCollection.driverId = collections[index].driverId;
            modCollection.locationType = collections[index].locationType;
            modCollection.truckId = collections[index].truckId;
            modCollection.volume = collections[index].volume;
            modCollection.location = collections[index].location;
            modCollection.type = collections[index].type;
            modCollection.createdTimeStamp = collections[index].createdTimeStamp;
        
            company.findOne({_id: collections[index].companyId}, function(err, company){
                if (err){
                    console.log(err);
                }
                modCollection.companyName = company.name;  
                modCollections.push(modCollection);
                if (modCollections.length === collections.length) {
                    res.status(200).json(modCollections);
                }
            });
        });
        
        
        //console.log(modCollections);
        //cb(null, collections);
    }).sort({companyId: 1});
};

exports.listSpreadsiteData = function(user, year, spreadS, cb){
    //console.log("in get Spreadsite list for report");
    var query = {};
    query.spreadSiteId = spreadS;
    if(user.type === 'contractor'){
        query = {companyId: user.companyId.toString()};
    }
    if (year == new Date().getFullYear().toString()){
        var tDate = new Date();
        var qDate = new Date(tDate.getFullYear()-1, tDate.getMonth(), tDate.getDate()).toISOString();
        query.dischargeTimeStamp = {"$gte":  new Date(qDate)};
        var qeDate = new Date('December 31, '+ year).toISOString();
        query.dischargeTimeStamp.$lte = new Date(qeDate);
    } else {
        var qDate = new Date('January 1, '+ year).toISOString();
        query.dischargeTimeStamp = {"$gte":  new Date(qDate)};
        var qeDate = new Date('December 31, '+ year).toISOString();
        query.dischargeTimeStamp.$lte = new Date(qeDate);
    }
    //console.log("My Query is:");
    //console.log(query);
    collection.find(query, function(err, collections){
        //console.log(query);
        //console.log(collections.length);
        if(err){
            console.log(err);
            cb({code: 400, message: err.message}, null);
            return;
        }
        
        var modCollections = [];
        //console.log(collections.length);
        //console.log(collections);
        collections.forEach(function (element, index){
            var modCollection = {};
            modCollection._id = collections[index]._id;
            modCollection.companyId = collections[index].companyId;
            modCollection.driverId = collections[index].driverId;
            modCollection.truckId = collections[index].truckId;
            modCollection.volume = collections[index].volume;
            modCollection.type = collections[index].type;
            modCollection.spreadSiteId = collections[index].spreadSiteId;
            modCollection.dischargeLocation = collections[index].dischargeLocation;
            modCollection.dischargeTimeStamp = collections[index].dischargeTimeStamp;
        
            company.findOne({_id: collections[index].companyId}, function(err, company){
                if (err){
                    console.log(err);
                }
                modCollection.companyName = company.name;  
                spreadsite.findOne({_id: collections[index].spreadSiteId}, function(err, spreadsite){
                    if (err){
                        console.log(err);
                    }
                    if(spreadsite !== null){
                        modCollection.spreadsiteName = spreadsite.name;
                        modCollection.nitro = spreadsite.nitro;
                        modCollection.acres = spreadsite.acres;
                    }
                    modCollections.push(modCollection);
                    if (modCollections.length === collections.length) {
                        cb(null, modCollections);
                    }
                });
            });
        });
        
    }).sort({spreadSiteId: 1});
};