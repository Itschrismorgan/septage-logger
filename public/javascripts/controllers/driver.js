septageLogger.controller('DriverCtlr',
    ['$scope', '$routeParams', '$http', '$location', 'truckService', 'userService', 'googleMapService', 'collectionService', 'spreadSiteService', 'logoutService',
        function($scope, $routeParams, $http, $location, truckService, userService, googleMapService, collectionService, spreadSiteService, logoutService){

    $scope.collection = {};
    $scope.inprocessCollections = [];
    $scope.mapOptions = {draggable: false, streeViewControl: false};
    $scope.spreadSites = [];

    reloadPendingCollections();

    spreadSiteService.getSpreadSiteList()
        .then(function(data){
            console.log(data);
            data.data.forEach(function(record){
                $scope.spreadSites.push(record);
            })
        }, function(error){
            console.log(error);
        });

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

    function getCurrentLocation(cb){
        navigator.geolocation.getCurrentPosition(function(position){
            var latitude  = position.coords.latitude;
            var longitude = position.coords.longitude;
            cb(null, latitude, longitude);
        }, function(){
            cb(error);
        });
    }

    $scope.submitPickup = function(){
        console.log($scope);
        var pickup = {
            truckId: $scope.collection.selectedTruck._id,
            location:{
                latitude: $scope.map.center.latitude,
                longitude: $scope.map.center.longitude,
                address: $scope.collection.address
            },
            locationType: $scope.collection.addressType,
            type: $scope.collection.type,
            volume: $scope.collection.volume
        };

        if($scope.accountType === 'driver'){
            pickup.driverId = $scope.username;
        }

        collectionService.submitCollection(pickup)
            .then(function(data){
                console.log(data);
                reloadPendingCollections();
                clearCollectionFields();
            }, function(error){
                console.log("error");
            });
        console.log(pickup);
    };

    $scope.discharge = function(collection, spreadSite){
        collection.spreadSiteId = spreadSite._id;
        collection.dischargeTimeStamp = new Date();

        collection.dischargeLocation = {};

        getCurrentLocation(function(err, latitude, longitude){
            if(err){
                console.log("could not get geo location");
            } else {
                collection.dischargeLocation.latitude = latitude;
                collection.dischargeLocation.longitude = longitude;
            }

            console.log(collection);
            collectionService.submitCollection(collection)
                .then(function(data){
                    console.log(data);
                    reloadPendingCollections();
                }, function(error){
                    console.log("error");
                });
        });
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

    function reloadPendingCollections(){
        $scope.inprocessCollections = [];
        collectionService.getCollections(true)
        .then(function(data){
            console.log(data);
            data.data.forEach(function(record){
                $scope.inprocessCollections.push(record);
            })
        }, function(error){
            console.log(error);
        });
    }


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

    function clearCollectionFields(){
        $scope.collection = {};
    }

    //Luke added button control here
    $scope.setButton = function(value){
        $scope.button = value;
        console.log($scope.button);
    };

    $scope.isButton = function(value){
        return $scope.button === value;
    };
    
    $scope.sendLogout = function(){
        logoutService.logout()
            .then(function(data){
                //console.log("login good");
                //a test
                $location.url("/");
                    }, function(error){
                        console.log("problem");
                    });
            }, function(error){
                //console.log("login bad");
            };

}]);