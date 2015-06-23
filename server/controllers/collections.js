/**
 * Created by chrismorgan on 5/18/15.
 */

var mongoose = require('mongoose');

var collection = mongoose.model('Collection');


exports.createCollection = function(recordToCreate,user, cb){
    console.log('in creatCollection');
    //console.log(user);
    //console.log(recordToCreate);

    try {
        var newCollection = {
            companyId: user.companyId.toString(),
            driverId: recordToCreate.driverId,
            pickUpDate: recordToCreate.pickUpDate,
            location: {
                latitude: recordToCreate.location.latitude,
                longitude: recordToCreate.location.longitude,
                address: recordToCreate.location.address
            },
            locationType: recordToCreate.locationType,
            truckId: recordToCreate.truckId,
            volume: recordToCreate.volume,
            type: recordToCreate.type
        };
    } catch(e){
        console.log(e);
        cb({code:400, message: err.message});
    }

    //console.log('ready to create record');
    console.log(newCollection);
    collection.create(newCollection, function(err, collection){
        if(err){
            console.log(err);
            cb({code: 400, message: err.message},null);
            return;
        }

        cb(null, collection);
    });
};

exports.getCollection = function(collectionId,cb){
    console.log("in get collection");

    collection.findOne({_id: collectionId}, function(err, collection){
        if(err){
            cb({code: 400, message: err.message}, null);
            return;
        }

        cb(null, collection);
    });
};

exports.updateCollection = function(id, newCollection, cb){
    console.log("in update collection");

    collection.findByIdAndUpdate(id, newCollection, function(err, collection){
        if(err){
            cb({code:400, message: err.message}, null);
        }

        cb(null, collection);
    });

};

exports.listCollections = function(user, inprocess, cb){
    //console.log("in get controller collection::listCollections");

    var query = {};

    if(inprocess){
        query.spreadSiteId = {$exists: false};
    }
    if(user.type !== 'admin'){
        query.companyId = user.companyId;
    }
    if(user.type === 'driver'){
        query.driverId = user._id;
    }

    //console.log(query);
    collection.find(query, function(err, collections){
        if(err){
            cb({code: 400, message: err.message}, null);
            return;
        }

        cb(null, collections);
    });

};

exports.deleteCollection = function(collectionId, cb){
    console.log("in delete collection method");

    collection.remove({_id: collectionId}, function(err){
        if(err){
            cb({code: 400, message: err.message}, null);
            return;
        }

        cb(null, {_id: collectionId, message: "record deleted"});
    });
};
