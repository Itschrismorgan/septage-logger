var mongoose = require('mongoose');
var truck = mongoose.model('Truck');
var company = mongoose.model('Company');

exports.createTruck = function(req, res){
    console.log(req.body);
    if (req.user.type === 'admin' || req.user.type === 'contractor'){
        var newTruck = req.body;
        company.findOne({name: req.body.company}, function(err, company){
            if(err){
                console.log(err);
                res.status(500).json({code: 500, message: err});
            }
            
            var truckToCreate = {
                    _id: req.body.vin,
                    capacity: req.body.capacity,
                    license: req.body.tag,
                    nickname: req.body.nickname,
                    make: req.body.make,
                    model: req.body.model,
                    year: req.body.year,
                    color: req.body.color,
                    companyId: company._id
                };
                            
            truck.create(truckToCreate, function(err, truck){
                if(err){
                    console.log(err);
                    res.status(500).json({code: 500, message: err});
                }
                
                res.status(200).json(truck);
            });

        });
    } else {
        res.status(401).json({code: 401, message: 'not authorized to create truck records'});
    }
};

exports.getTruckList = function(req, res){
    console.log(req.user);
    if(req.user.type === "admin"){
        truck.find({}, function(err, trucks){
            if(err) {
                res.status(500).json({code: 500, message: "failed to retrieve trucks"});
            }
            
            if(!trucks){
                res.status(404).json({code: 404, message: "no trucks found"})
            } else {
                res.status(200).json(trucks);
            }
        });  
    }
    else {
        truck.find({companyId: req.user.companyId}, function(err, trucks){
            if(err) {
                res.status(500).json({code: 500, message: "failed to retrieve trucks"});
            }
            
            if(!trucks){
                res.status(404).json({code: 404, message: "no trucks found"})
            } else {
                res.status(200).json(trucks);
            }
        });
    }
    console.log('getting truck list');
};

exports.updateTruck = function(req, res){
    console.log('updating truck');
    res.status(200).json(req.body);
};

exports.deleteTruck = function(req,res){
    console.log('delete truck');
    res.status(200).json({code: 200, message: "resource deleted"});
};

exports.getTruck = function(req,res){
    console.log('get truck');
    res.status(200).json({code: 200, message: "this is the truck you are looking for"});
};