var septageLogger = angular.module('septageLogger',['ngRoute']);


septageLogger.controller('MainCtrl',['$scope', function($scope){
}]);

septageLogger.controller('IndexCtrl',['$scope',function($scope){
    $scope.name = 'Free Code Camp';
    
}]);

septageLogger.controller('UserCtrl',['$scope', '$routeParams', 'userService', function($scope, $routeParams, userService){
    //console.log($routeParams.username);
    
    fillInUserList();
    clearFields();
    
    
    $scope.$watch('selectedUser', function(newSelectedUser){
        if(newSelectedUser === "" || newSelectedUser === undefined){
            // clear out the form inputs
            $scope.newUser = {};
        } else {
            userService.getUser(newSelectedUser)
            .then(function(returnData){
                //console.log(returnData);
                //console.log($scope.newUser);
                $scope.newUser.username = returnData.data.username;
                $scope.newUser.password = "";
                $scope.newUser.email = returnData.data.email;
                $scope.newUser.type = returnData.data.type;
                if(returnData.data.active){
                    $scope.newUser.active = 'yes';
                } else {
                    $scope.newUser.active = 'no';
                }
            }, function(err){
                console.log("problem");
            });
            
        }
    });
    
    
    userService.getUser($routeParams.username)
        .then(function(data){
            $scope.username = data.data.username;
            $scope.accountType = data.data.type;
        }, function(error){
            console.log("problem");
        });
        
        
    $scope.deleteUser = function(){
        if($scope.userList.indexOf($scope.newUser.username) !== -1){
            // send delete request
            userService.deleteUser($scope.newUser.username)
                .then(function(data){
                    fillInUserList();
                    clearFields();
                }, function(error){
                    console.log("problem");
                });
        }
    };
        
    $scope.createUser = function(){
        if($scope.userList.indexOf($scope.newUser.username) !== -1 ){
            //console.log("update user");
            userService.updateUser($scope.newUser)
                .then(function(data){
                    //console.log("user updated");
                    clearFields();
                }, function(error){
                    console.log("problem");
                });
            
        } else {
            //console.log("create user");
            //console.log($scope.newUser);
            userService.createUser($scope.newUser)
                .then(function(data){
                    //console.log("user created");
                    fillInUserList();
                    clearFields();
                }, function(error){
                    console.log("problem");
                });
        }
    };
    
    //Luke added button control here
    $scope.setButton = function(value){
        $scope.button = value;
    };
    
    $scope.isButton = function(value){
        return $scope.button === value;
    };
    
    function fillInUserList(){
        $scope.userList = [];
        userService.getUserList()
            .then(function(response){
                //console.log(response);
                response.data.map(function(user){
                    //console.log(user);
                    $scope.userList.push(user._id);    
                    //console.log($scope.userList);
                });
            }, function(error){
                console.log("no users returned");
            });
    };
    
    function clearFields(){
        $scope.newUser = {};
        $scope.newUser.username = "";
        $scope.newUser.password = "";
        $scope.newUser.email = "";
        $scope.newUser.type = "";
    };
}]);


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
        return $http.post('/users/'+user.username, user)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e;
            });
    };
    
    this.deleteUser = function(username){
        return $http.delete('/users/'+username)
            .success(function(data){
                console.log(data);
            })
            .error(function(e){
                return e;
            });
        
    };
    
    this.getUserList = function(){
        return $http.get('/users')
            .success(function(data){return data;})
            .error(function(e) {return e;});
    };
}]);


septageLogger.controller('LoginCtrl',['$scope', '$location', 'loginService', function($scope, $location, loginService){
    
    
    $scope.sendLogin = function(){
        loginService.login($scope.login.username, $scope.login.password)
            .then(function(data){
                //console.log("login good");
                $scope.loginResult = "";
                $scope.login.password = "";
                $location.url("/user/"+$scope.login.username);
            }, function(error){
                //console.log("login bad");
                $scope.login.username = "";
                $scope.login.password = "";
                $scope.loginResult = "has-error";
            });
    };
}]);

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


septageLogger.config(function($routeProvider) {
$routeProvider.
when('/', {
templateUrl: 'javascripts/views/home.html',
controller: 'IndexCtrl'
}).
when('/login', {
   templateUrl: 'javascripts/views/login.html',
   controller: 'LoginCtrl'
}).
when('/user/:username',{
    templateUrl: 'javascripts/views/user.html',
    controller: 'UserCtrl'
}).
otherwise('/');
});