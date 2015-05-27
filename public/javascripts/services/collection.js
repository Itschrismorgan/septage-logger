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

    this.getCollections = function(inprocess){
        // if inprocess then we only collections that haven't been dumped yet
        var url = '/collections';
        if(inprocess){
            url = url + "?inprocess=true"
        }
        return $http.get('/collections')
            .success(function(data){
                //console.log(data);
            })
            .error(function(e){
                return e;
            });
    };
}]);