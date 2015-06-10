/* 
  Controller for Reports
*/
var mongoose = require('mongoose');

var truck = mongoose.model('Truck');
var company = mongoose.model('Company');
var collection = mongoose.model('Collection');

exports.listTrucksAndCollections = function(user, cb){
    console.log("in get Collections list for report");
    console.log(user);
    var query = {};
    if(user.type === 'contractor'){
        query = {companyId: user.companyId.toString()};
    }
    console.log(query);
    collection.find(query, function(err, collections){
        if(err){
            cb({code: 400, message: err.message}, null);
            return;
        }

        cb(null, collections);
    });
};