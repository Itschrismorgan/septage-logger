var mongoose = require('mongoose');
var truck = mongoose.model('Truck');
var company = mongoose.model('Company');

exports.createTruck = function(req, res){
    //console.log(req.body);
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
                    stat: req.body.stat,
                    companyId: company._id,
                    approvedDrivers: req.body.approvedDrivers
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
    //console.log("in get TruckList");
    //console.log(req.user);
    if(req.user){
        var query = {};
        if (req.user.type === 'contractor' || req.user.type === 'driver'){
            query.companyId = req.user.companyId;
        }
        if (req.user.type === 'driver'){
            query.approvedDrivers = {$eq: req.user._id};
        }
        //console.log(query);

        truck.find(query, function(err, trucks){
            if(err) {
                res.status(500).json({code: 500, message: "failed to retrieve trucks"});
            }

            if(!trucks){
                res.status(404).json({code: 404, message: "no trucks found"});
            } else {
                var returnTrucks = [];
                trucks.forEach(function (truck, index){
                    var modTruck = {};
                    modTruck._id = truck._id;
                    modTruck.capacity = truck.capacity;
                    modTruck.license = truck.license;
                    modTruck.nickname = truck.nickname;
                    modTruck.make = truck.make;
                    modTruck.model = truck.model;
                    modTruck.year = truck.year;
                    modTruck.color = truck.color;
                    modTruck.companyId = truck.companyId;
                    modTruck.approvedDrivers = truck.approvedDrivers;
                    modTruck.stat = truck.stat;

                    company.findOne({_id: truck.companyId}, function(err, company){
                        if (err){
                            console.log(err);
                        }
                        //console.log(company.name);
                        modTruck.companyName = company.name;

                        //console.log(modTruck);
                        returnTrucks.push(modTruck);
                        if (returnTrucks.length === trucks.length) {
                            //console.log(returnTrucks);
                            res.status(200).json(returnTrucks);
                        }
                    });
                });
            }
        });

    } else {
        res.status(401).json({code: 401, message: 'not authorized for this resource'});
    }
};

exports.updateTruck = function(req, res){
    //console.log('in update truck');
    company.findOne({name: req.body.company},function(err, company){
        if(err){
            res.status(500).json({code:500, message: "Server error retrieving company record"});
        } else {
            if(!company){
                res.status(404).json({code:404, message: "company record not found"});
            } else {
                //console.log("in updateTruck!!!");
                //console.log(req.body);
                var truckToUpdate = req.body;
                truckToUpdate.companyId = company._id;
                //console.log(truckToUpdate);
                truck.findByIdAndUpdate(req.params.truck_id, truckToUpdate, {new: true}, function(err, truckRet){
                    if(err){
                        res.status(500).json({code:500, message: "error updating truck", error: err});
                    }

                    //console.log("I'm gonna find one!");
                    //console.log(truckRet);
                    if(!truckRet){
                        res.status(404).json({code:404, message: "truck not found"});
                    } else {
                        res.status(200).json({code: 200, message: "truck updated", truck: truckRet});
                    }
                });
            }
        }
    });
};

exports.deleteTruck = function(req,res){
    //console.log('delete truck');
    //console.log(req.params);
    //res.status(200).json({code: 200, message: "resource deleted"});
    truck.findOne({_id: req.params.truck_id}, function(err, truck){
        if(err) {
            res.status(500).json({code: 500, message: "failed to delete truck"});
        }

        if(!truck){
            res.status(404).json({code: 404, message: "truck not found"})
        } else {
            truck.remove({_id: req.params.truck_id}, function(err){
                if(err) {
                    res.status(500).json({code: 500, message: "failed to delete truck"});
                }

                res.status(200).json({code: 200, message: req.params.truck_id+" deleted"});
            });
        }
    });
};

exports.getTruck = function(req,res){
    //console.log('get truck');
    
    truck.findOne({_id: req.params.truck_id}, function(err, truck){
        if(err) {
            res.status(500).json({code: 500, message: "failed to find truck"});
        }

        if(!truck){
            res.status(404).json({code: 404, message: "truck not found"})
        } else {
                company.findOne({_id: truck.companyId}, function(err, company){
                if (err){
                    res.status(500).json({code:500, message: "Get company: server error"});
                }
                
                var gotTruck = {};
                gotTruck.company = company.name;
                gotTruck._id = truck._id;
                gotTruck.capacity = truck.capacity;
                gotTruck.license = truck.license;
                gotTruck.tag = truck.tag;
                gotTruck.nickname = truck.nickname;
                gotTruck.make = truck.make;
                gotTruck.model = truck.model;
                gotTruck.year = truck.year;
                gotTruck.color = truck.color;
                gotTruck.stat = truck.stat;
                gotTruck.approvedDrivers = truck.approvedDrivers;
            
                res.status(200).json(gotTruck);
            });
        }
    });
};