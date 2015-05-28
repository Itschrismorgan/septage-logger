/**
 * Created by chrismorgan on 5/21/15.
 */
septageLogger.service('collectionService', ['$http', function($http){

    this.submitCollection = function(pickupRec){
        
        var url = "/collections";
        if(pickupRec._id){
            //This is an update not a create new record
            url = url+"/"+pickupRec._id;
            //console.log(url);
        }
        
        return $http.post(url, pickupRec)
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
        //console.log(inprocess);
        if(inprocess){
            //console.log('adding inprocess');
            url = url + "?inprocess=true"
        }
        return $http.get(url)
            .success(function(data){
                //console.log(data);
            })
            .error(function(e){
                return e;
            });
    };
}]);