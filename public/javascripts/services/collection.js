/**
 * Created by chrismorgan on 5/21/15.
 */
septageLogger.service('collectionService', ['$http', function($http){

    this.submitCollection = function(pickupRec){
        return $http.post('/collections', pickupRec)
            .success(function(data){
                //console.log('user returned');
                console.log(data);
            })
            .error(function(e){
                return e;
            });
    };

}]);