septageLogger.controller('DriverCtlr',
    ['$scope', '$routeParams', '$http', 'truckService', 'userService', 'googleMapService',
        function($scope, $routeParams, $http, truckService, userService, googleMapService){

//    if ("geolocation" in navigator) {
  //      $scope.map = { center: {latitude: xx, longitude: xx), zoom: 2}};
    //} else {
        /* geolocation IS NOT available */
    //    console.log("Geolocation is not available");
    //}



    $scope.collection = {};

    $scope.mapOptions = {draggable: false, streeViewControl: false};

    function success(position) {
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;

        $scope.map = { center: {latitude: latitude, longitude: longitude}, zoom: 18};
        $scope.marker = {
            id: 0,
            coords: {
                latitude: latitude,
                longitude: longitude
            },
            options: {
                draggable: false,
                labelContent: "You are here",
                lableAnchor: "100 0",
                labelClass: "marker-labels"
            }
        };
        googleMapService.addressLookup(latitude, longitude)
            .then(function(data){
                //console.log(data);
                data.data.results.forEach(function(record){
                    //console.log(record);

                    if(record.types.indexOf('street_address') !== -1){
                        $scope.collection.address = record.formatted_address;
                    }
                });
            }, function(error){
                console.log(error);
            })
    }

    function error() {
        console.log("Unable to retrieve your location");
    }

    navigator.geolocation.getCurrentPosition(success, error);

    $scope.reloadCoordinates = function(){
        navigator.geolocation.getCurrentPosition(success, error);
    };


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