septageLogger.service('logoutService',['$http', function($http){
    this.logout = function(){
        return $http.get('/logout')
            .success(function(data){
            })
            .error(function(e){
                return e;
            });
    };
}]);
