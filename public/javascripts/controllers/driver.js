septageLogger.controller('DriverCtlr',
    ['$scope', '$routeParams', '$http', '$location', 'truckService', 'userService', 'googleMapService', 'collectionService', 'spreadSiteService', 'logoutService', 'flash',
        function($scope, $routeParams, $http, $location, truckService, userService, googleMapService, collectionService, spreadSiteService, logoutService, flash){

    $scope.collection = {};
    $scope.inprocessCollections = [];
    $scope.mapOptions = {draggable: false, streeViewControl: false};
    $scope.spreadSites = [];
    //$scope.opened = null;

    reloadPendingCollections();

    spreadSiteService.getSpreadSiteList()
        .then(function(data){
            //console.log(data);
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
        //console.log($scope);
        var pickup = {
            truckId: $scope.collection.selectedTruck._id,
            pickUpDate: $scope.collection.date,
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
        
        if($scope.collection.address === undefined || $scope.collection.address === ""){
            addFlashWarn('Please Reset Location');
        }
        collectionService.submitCollection(pickup)
            .then(function(data){
                //console.log(data);
                reloadPendingCollections();
                clearCollectionFields();
                addFlash('Septage Pickup Logged!');
            }, function(error){
                console.log("error");
            });
        //console.log(pickup);
    };

    $scope.discharge = function(collection, spreadSite){
        if (!spreadSite){
            addFlashWarn('Please select a spreadsite');
        }
        if(spreadSite){
            addFlash('Submitting...',5000);
        }
        $scope.inprocessCollections.forEach(function(element){
           element.spreadSiteId = spreadSite._id;
           element.dischargeTimeStamp = new Date();

           element.dischargeLocation = {};

           getCurrentLocation(function(err, latitude, longitude){
               if(err){
                   console.log("could not get geo location");
               } else {
                   element.dischargeLocation.latitude = latitude;
                   element.dischargeLocation.longitude = longitude;
               }

               //console.log(collection);
               collectionService.submitCollection(element)
                   .then(function(data){
                       //console.log(data);
                       addFlash('Septage Pickups Discharged!');
                       reloadPendingCollections();
                   }, function(error){
                       console.log("error");
                   });
           });
        });
        /*collection.spreadSiteId = spreadSite._id;
        collection.dischargeTimeStamp = new Date();

        collection.dischargeLocation = {};

        getCurrentLocation(function(err, latitude, longitude){
            if(err){
                console.log("could not get geo location");
            } else {
                collection.dischargeLocation.latitude = latitude;
                collection.dischargeLocation.longitude = longitude;
            }

            //console.log(collection);
            collectionService.submitCollection(collection)
                .then(function(data){
                    //console.log(data);
                    reloadPendingCollections();
                }, function(error){
                    console.log("error");
                });
        });*/
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
            //console.log(data);
            data.data.forEach(function(record){
                $scope.inprocessCollections.push(record);
                //console.log($scope.inprocessCollections);
            })
        }, function(error){
            console.log(error);
        });
    }


    function reloadTruckList(){
        $scope.truckList = [];
        truckService.getTruckList()
            .then(function(response){
                response.data.forEach(function(truck){
                    $scope.truckList.push(truck);
                });
                console.log($scope.truckList);
                $scope.collection.selectedTruck = $scope.truckList[0];
            }, function(error){
                console.log(error);
            });
    }

    function clearCollectionFields(){
        var oldCollection = $scope.collection;
        $scope.collection = {};
        $scope.collection.selectedTruck = oldCollection.selectedTruck;
        $scope.collection.date = new Date();
        $scope.collection.volume = "1000";
        $scope.collection.type = "domestic";
        $scope.collection.addressType = "residential";
    }

    //Luke added button control here
    $scope.setButton = function(value){
        $scope.button = value;
        //console.log(value);
        if (value === 1){
            $scope.collection.date = new Date();
            $scope.collection.volume = "1000";
            $scope.collection.type = "domestic";
            $scope.collection.addressType = "residential";
            $scope.reloadCoordinates();
        }
    };

    $scope.isButton = function(value){
        return $scope.button === value;
    };
    
    $scope.sendLogout = function() {
        logoutService.logout()
            .then(function (data) {
                //console.log("login good");
                //a test
                $location.url("/");

            }, function (error) {
                //console.log("login bad");
            });
    };

    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };


    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        $scope.opened = true;
    };


    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        showButtonBar: false
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);

    $scope.events =
        [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

    $scope.getDayClass = function(date, mode) {
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i=0;i<$scope.events.length;i++){
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    };
    
    function addFlash(message, time){
        if (!time){
            time = 3000;
        }
        flash(message);
        if (document.getElementById('flash-remove')) {
            document.getElementById('flash-remove').id = 'flash-messages'; 
        }
        setTimeout(function (){
            flash('');
            var flashEl = document.getElementById('flash-messages');
            flashEl.id = 'flash-remove';
        },time);
    }
    
    function addFlashWarn(message, time){
        if (!time){
            time = 3000;
        }
        flash(message);
        if (document.getElementById('flash-remove')) {
            document.getElementById('flash-remove').id = 'flash-warn'; 
        } else if (document.getElementById('flash-messages')){
            document.getElementById('flash-messages').id = 'flash-warn';
        }
        setTimeout(function (){
            flash('');
            var flashEl = document.getElementById('flash-warn');
            flashEl.id = 'flash-remove';
        },time);
    }

}]);