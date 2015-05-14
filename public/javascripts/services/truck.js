septageLogger.service('truckService', ['$http', function($http){
    this.getTruck = function(vin){
        //console.log('userService::getUser', username);
        return $http.get('/trucks/'+vin)
            .success(function(data){
                //console.log('user returned');
                //console.log(data);
            })
            .error(function(e){
                return e;
            });
    };

    this.createTruck = function(truck){
        return $http.post('/trucks',truck)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e;
            });
    };

    this.updateTruck = function(truck){
        return $http.post('/trucks/'+truck.vin, truck)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e;
            });
    };

    this.deleteTruck = function(vin){
        console.log(vin);
        return $http.delete('/trucks/'+vin)
            .success(function(data){
                console.log(data);
            })
            .error(function(e){
                return e;
            });

    };

    this.getTruckList = function(){
        return $http.get('/trucks')
            .success(function(data){return data;})
            .error(function(e) {return e;});
    };
}]);