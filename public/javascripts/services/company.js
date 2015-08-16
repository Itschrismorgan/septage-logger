septageLogger.service('companyService', ['$http', function($http){


    this.createCompany = function(company){
        return $http.post('/company', company)
            .success(function(data){return data;})
            .error(function(e){return e;});
    };

    this.getCompanyList = function(){
        return $http.get('/company')
            .success(function(data){return data;})
            .error(function(e) {return e;});
    };

    this.getCompany = function(company){
        return $http.get('/company/'+company)
            .success(function(data){return data;})
            .error(function(e){return e;});
    };

    this.updateCompany = function(company){
        return $http.post('/company/'+company.name, company)
            .success(function(data){return data;})
            .error(function(e){return e;});
    }
}]);