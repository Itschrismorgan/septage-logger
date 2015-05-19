/**
 * Created by chrismorgan on 5/18/15.
 */

var mongoose = require('mongoose');

var collection = mongoose.model('Collection');


exports.createCollection = function(recordToCreate, cb){
    console.log('in creatCollection');


    var newCollection = {
        companyId: recordToCreate.companyId,
        driverId: recordToCreate.driverId,
        location:{
            latitude: recordToCreate.latitude,
            longitude: recordToCreate.longitude,
            address: recordToCreate.address
        },
        locationType: recordToCreate.locationType,
        truckId: recordToCreate.truckId,
    };

    collection.create(newCollection, function(err, collection){
        if(err){
            cb({code: 400, message: err.message},null);
            return;
        }

        cb(null, collection);
    });
};

exports.getCollection = function(res,req,next){

};

exports.updateCollection = function(res, req, next){

};

exports.listCollections = function(res,req, next){

};

exports.deleteCollection = function(res,req, next){

};
