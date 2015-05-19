var express = require('express');
var router = express.Router();
var company = require('../server/controllers/company');

/* GET company listing. */
router.get('/', function(req, res, next) {
    //console.log("first test");
    company.getCompanyList(req,res);
});

router.post('/', function(req, res, next){
    //console.log("in company post");
    //console.log(req.body);
    company.createCompany(req, res);
    /*if(req.user.type === "admin"){
        //console.log("is an admin")
        company.createCompany(req,res);
    } else {
        res.status(401).json({code: 401, message: 'not authorized to create companies'});
    }*/
});


router.get('/:companyname', function(req,res,next){
    //console.log(req.user);
    //console.log(decodeURIComponent(req.params.companyname));
    if(req.user.type === "contractor" || req.user.type === "admin"){
        // user can get info on themselves or admin can see all users
        company.getCompany(req,res);
    } else {
        res.status(401).json({code: 401, message: 'not authorized for requested info'});        
    }
});

/*
router.post('/:companyname', function(req,res,next){
    if(req.user === req.params.username || req.user.type === 'admin'){
        company.updateUser(req,res);
    } else {
        res.status(401).json({code: 401, message: 'not authorized for the requested action'});   
    }
});


router.delete('/:companyname', function(req, res, next){
    company.deleteUser(req,res);
})
*/

module.exports = router;
