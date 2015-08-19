var mongoose = require('mongoose');

var company = mongoose.model('Company');





exports.createCompany = function(req,res){
    //console.log("in controller:createUser");
    
    var companyToCreate = {
        name: req.body.name,
        phone: req.body.phone,
        active: true
    };
    
    
    //console.log(userToCreate);
    company.findOne({name: req.body.name},function(err, companyRec){
        if(err){
            //console.log("failed to create company");
            console.log(err);
            res.status(500).json({code: 500, message: "Failed to create company"});
        }
        if(!companyRec){
            company.create(companyToCreate, function(err){
                if(err){
                    //user creation failed
                    //console.log("failed to create company");
                    console.log(err);
                    res.status(500).json({code: 500, message: "Failed to create company"});
                }

                //console.log(companyToCreate.name+" created.");
                res.status(200).json({name: companyToCreate.name});
            });
        } else {
            //console.log("duplicate company");
            res.status(400).json({code: 400, message: "That company already exist."});
        }
    });
};


exports.updateCompany = function(req,res){
    //console.log("in controller:updateCompany");

    //console.log(req.body);


    company.findOne({name: req.body.name},function(err, companyRec){
        if(err){
            res.status(500).json({code:500, message: "Server error retrieving company record"});
        } else {
            if(!companyRec){
                res.status(404).json({code:404, message: "company record not found"});
            } else {
                var companyToUpdate = {
                    name: req.body.name,
                    phone: req.body.phone
                };
                if(req.body.active === "no"){
                    companyToUpdate.active = false;
                } else {
                    companyToUpdate.active = true;
                }
                //console.log(companyToUpdate);

                company.findByIdAndUpdate(companyRec._id, companyToUpdate , {new: true}, function(err, companyRet){
                    //console.log(err);
                    //console.log(companyRet);
                    if(err){
                        console.log(err);
                        res.status(500).json({code:500, message: "error updating company", error: err});
                    }

                    //console.log(companyRet);

                    if(!companyRet){
                        res.status(404).json({code:404, message: "company not found"});
                    } else {
                        //console.log('check1');
                        res.status(200).json(companyRet);
                        //console.log('check2');
                    }
                });
            }
        }
    });
};

exports.getCompany = function(req,res){
    
    company.findOne({name: decodeURIComponent(req.params.companyname)}, function(err, company){
        if(err){
            console.log(err);
            res.status(500).json({code:500, message: "GetCompany: Server error"});
        }
        
        if(!company){
            res.status(404).json({code:404, message: "company not found"});
        } else {
            res.status(200).json(company);
        }
    });
    
    
};

exports.getCompanyList = function(req,res){
    company.find({}, '_id name phone active', function(err, companies){
        if(err) {
            res.status(500).json({code: 500, message: "failed to get company list"});
        }
        
        if(!companies){
            res.status(404).json({code: 404, message: "no companies found"})
        } else {
            res.status(200).json(companies);
        }
    }).sort({name: 1}); 
};