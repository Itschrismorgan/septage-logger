/**
 * Created by chrismorgan on 5/26/15.
 */


var mongoose = require('mongoose');

var spreadSite = mongoose.model('SpreadSite');
var company = mongoose.model('Company');


exports.createSpreadSite = function(recordToCreate,user, cb){
    console.log('in createSpeadSite');
    console.log(user);
    console.log(recordToCreate);

    try {
        var newSpreadSite = {
            name: recordToCreate.name,
            address: recordToCreate.address,
            contactName: recordToCreate.contactName,
            phone: recordToCreate.phone,
            approvedCompanies: recordToCreate.approvedCompanies
        };
    } catch(e){
        console.log(e);
        cb({code:400, message: err.message});
    }

    console.log('ready to create record');
    console.log(newSpreadSite);

    spreadSite.create(newSpreadSite, function(err, spreadSite){
        if(err){
            console.log(err);
            cb({code: 400, message: err.message},null);
            return;
        }

        cb(null, spreadSite);
    });
};

exports.getSpreadSite = function(spreadSiteId,user, cb){
    console.log("in get collection");

    spreadSite.findOne({_id: spreadSiteId}, function(err, spreadSite){
        if(err){
            cb({code: 400, message: err.message}, null);
            return;
        }

        cb(null, spreadSite);
    });
};

exports.updateSpreadSite = function(id, newSpreadSite, cb){
    console.log("in update collection");

    spreadSite.findByIdAndUpdate(id, newSpreadSite, function(err, data){
        if(err){
            cb({code:400, message: err.message}, null);
        }

        cb(null, newSpreadSite);
    });

};

exports.listSpreadSites = function(user, cb){
    console.log("in get collection list");
    console.log(user);
    var query = {};
    if(user.type === 'driver'){
        query = {approvedCompanies: user.companyId.toString()};
    }
    console.log(query);
    spreadSite.find(query, function(err, spreadSites){
        if(err){
            cb({code: 400, message: err.message}, null);
            return;
        }

        cb(null, spreadSites);
    });
};

exports.deleteSpreadSite = function(spreadSiteId, cb){
    console.log("in delete collection method");

    spreadSite.remove({_id: spreadSiteId}, function(err){
        if(err){
            cb({code: 400, message: err.message}, null);
            return;
        }

        cb(null, {_id: collectionId, message: "record deleted"});
    });
};
