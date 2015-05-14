septageLogger.service('loginService',['$http', function($http){
    this.login = function(username, password){
        //console.log('loginService::login', username, password);
        return $http.post('/login',{username: username, password: password})
            .success(function(data){
                //console.log('login returned');
                //console.log(data);
                return data;
            })
            .error(function(e){
                return e;
            });
    };
}]);
