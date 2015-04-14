var septageLogger = angular.module('septageLogger',['ngRoute']);


septageLogger.controller('MainCtrl',['$scope', function($scope){
}]);

septageLogger.controller('IndexCtrl',['$scope',function($scope){
    $scope.name = 'Free Code Camp';
    
}]);

septageLogger.controller('LoginCtrl',['$scope', '$location', 'loginService', function($scope, $location, loginService){
    
    
    $scope.sendLogin = function(){
        console.log($scope.login.username);
        console.log($scope.login.password);
        loginService.login($scope.login.username, $scope.login.password)
            .then(function(data){
                console.log("login good");
                $location.url("/");
            }, function(error){
                console.log("login bad");
                $scope.login.username = "";
                $scope.login.password = "";
            });
        
        
    /*            authService.authorize($scope.login.username,$scope.login.password)
            .then(function(data){
                $scope.loginMessage = "You have succesfully logged in...";
                $scope.messageStyle = "successBox";
                $scope.login.username = "";
                $scope.login.password = "";
                $location.url("/user");
            },function(error){
                if (error.data.code >= 400 && error.data.code <= 500){
                    $scope.loginMessage = error.data.message;
                    $scope.messageStyle = 'errorBox';
                }
                $scope.login.username = "";
                $scope.login.password = "";
            });*/
    };
}]);

septageLogger.service('loginService',['$http', function($http){
    
    
    this.login = function(username, password){
        console.log('loginService::login', username, password);
        return $http.post('/login',{username: username, password: password})
            .success(function(data){
                console.log('login returned');
                console.log(data);
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
otherwise('/');
});