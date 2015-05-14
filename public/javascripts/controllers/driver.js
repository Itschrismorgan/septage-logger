septageLogger.controller('DriverCtlr', ['$scope', '$routeParams', '$http', 'truckService', 'userService', function($scope, $routeParams, $http, truckService, userService){

    userService.getUser($routeParams.username)
        .then(function(data){
            $scope.username = data.data.username;
            $scope.accountType = data.data.type;
            $scope.company = data.data.company;
            reloadTruckList();
        }, function(error){
            console.log("problem");
        });


    function reloadTruckList(){
        $scope.truckList = [];
        truckService.getTruckList()
            .then(function(response){
                response.data.map(function(truck){
                    $scope.truckList.push(truck);
                });
            }, function(error){
                console.log(error);
            });
    }

    //Luke added button control here
    $scope.setButton = function(value){
        $scope.button = value;
    };

    $scope.isButton = function(value){
        return $scope.button === value;
    };

}]);