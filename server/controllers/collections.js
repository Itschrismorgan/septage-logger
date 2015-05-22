/**
 * Created by chrismorgan on 5/18/15.
 */

var mongoose = require('mongoose');

var collection = mongoose.model('Collection');


exports.createCollection = function(recordToCreate,user, cb){
    console.log('in creatCollection');
    console.log(user);
    console.log(recordToCreate);

    var newCollection = {
        companyId: user.companyId,
        driverId: recordToCreate.driverId,
        location:{
            latitude: recordToCreate.latitude,
            longitude: recordToCreate.longitude,
            address: recordToCreate.address
        },
        locationType: recordToCreate.locationType,
        truckId: recordToCreate.truckId,
        volume: recordToCreate.volume,
        type: recordToCreate.type
    };

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

    collection.findByIdAndUpdate(id, newCollection, function(err, data){
        if(err){
            cb({code:400, message: err.message}, null);
        }

        cb(null, collection);
    });

};

exports.listCollections = function(cb){
    console.log("in get collection list");

    collection.find({}, function(err, collections){
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
