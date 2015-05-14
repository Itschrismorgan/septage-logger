septageLogger.controller('LoginCtrl',['$scope', '$location', 'loginService', 'userService', function($scope, $location, loginService, userService){
    $scope.sendLogin = function(){
        loginService.login($scope.login.username, $scope.login.password)
            .then(function(data){
                //console.log("login good");
                $scope.loginResult = "";
                $scope.login.password = "";
                //a test
                userService.getUser($scope.login.username)
                    .then(function(data){
                        $scope.username = data.data.username;
                        $scope.accountType = data.data.type;
                        if ($scope.accountType !== 'driver'){
                            $location.url("/user/"+$scope.login.username);
                        } else {
                            $location.url("/driver/"+$scope.login.username);
                        }
                    }, function(error){
                        console.log("problem");
                    });
            }, function(error){
                //console.log("login bad");
                $scope.login.username = "";
                $scope.login.password = "";
                $scope.loginResult = "has-error";
            });
    };
}]);