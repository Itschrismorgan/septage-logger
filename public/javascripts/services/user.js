septageLogger.service('userService', ['$http', function($http){
    this.getUser = function(username){
        //console.log('userService::getUser', username);
        return $http.get('/users/'+username)
            .success(function(data){
                //console.log('user returned');
                //console.log(data);
            })
            .error(function(e){
                return e;
            });
    };

    this.createUser = function(user){
        return $http.post('/users',user)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e;
            });
    };

    this.updateUser = function(user){
        return $http.post('/users/'+user._id, user)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e;
            });
    };

    /*this.deleteUser = function(username){
        return $http.delete('/users/'+username)
            .success(function(data){
                console.log(data);
            })
            .error(function(e){
                return e;
            });

    };*/

    this.getUserList = function(){
        return $http.get('/users')
            .success(function(data){return data;})
            .error(function(e) {return e;});
    };
}]);
