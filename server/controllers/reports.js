/* 
  Controller for Reports
*/
var mongoose = require('mongoose');

var truck = mongoose.model('Truck');
var company = mongoose.model('Company');
var collection = mongoose.model('Collection');

exports.listTrucksAndCollections = function(user, res){
    console.log("in get Collections list for report");
    console.log(user);
    var query = {};
    if(user.type === 'contractor'){
        query = {companyId: user.companyId.toString()};
    }
    console.log(query);
    collection.find(query, function(err, collections){
        if(err){
            res.status(500).json({code:500, message: "GetUser: Server error"});
        }
        
        var modCollections = [];
        
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
                if (index === collections.length - 1) {
                    res.status(200).json(modCollections);
                }
            });
        });
        
        
        //console.log(modCollections);
        //cb(null, collections);
    }).sort({companyId: 1});
};