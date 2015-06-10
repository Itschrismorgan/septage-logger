
septageLogger.service('reportService', [ '$http', function($http){
    
    this.getCollectionReport = function () {
        return $http.get('/reports')
            .success(function(data){
                //console.log(data);
            })
            .error(function(e){
                return e;
            });
    }
}]);