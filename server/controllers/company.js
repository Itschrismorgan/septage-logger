var mongoose = require('mongoose');

var company = mongoose.model('Company');





exports.createCompany = function(req,res){
    console.log("in controller:createUser");
    
    var companyToCreate = {
        name: req.body.name,
        phone: req.body.phone,
        //trucks: [req.body.trucks[0]],
        active: true
    };
    
    
    //console.log(userToCreate);
    company.create(companyToCreate, function(err){
        if(err){
            //user creation failed
            console.log("failed to create company");
            console.log(err);
            res.status(500).json({code: 500, message: "Failed to create company"});
        }
        
        console.log(companyToCreate.name+" created.");
        res.status(200).json({name: companyToCreate.name});
    });
};

exports.getCompany = function(req,res){
    
    company.findOne({name: decodeURIComponent(req.params.companyname)}, function(err, company){
        if(err){
            console.log(err)
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
    });  
};