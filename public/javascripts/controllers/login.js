septageLogger.controller('LoginCtrl',['$scope', '$location', 'loginService', 'userService', function($scope, $location, loginService, userService){
    $scope.showMessage = false;
    $scope.sendLogin = function(){
        loginService.login($scope.login.username.toLowerCase(), $scope.login.password)
            .then(function(data){
                //console.log("login good");
                $scope.loginResult = "";
                $scope.login.password = "";
                //a test
                $scope.loginStatus = true;
                $scope.showMessage = true;
                $scope.loginResult = 'Success, redirecting . . .';
                userService.getUser($scope.login.username.toLowerCase())
                    .then(function(data){
                        $scope.username = data.data.username;
                        $scope.accountType = data.data.type;
                        if ($scope.accountType !== 'driver'){
                            $location.url("/user/"+$scope.login.username.toLowerCase()+'#scrollhere');
                        } else {
                            $location.url("/driver/"+$scope.login.username.toLowerCase());
                        }
                    }, function(error){
                        console.log("problem");
                    });
            }, function(error){
                console.log("login bad");
                console.log(error);
                $scope.login.username = "";
                $scope.login.password = "";
                $scope.loginStatus = false;
                $scope.showMessage = true;
                $scope.loginResult = error.data.message;
            });
    };
}]);