/**
 * Created by chrismorgan on 5/21/15.
 */
septageLogger.service('googleMapService', ['$http', function($http){


    this.addressLookup = function(lat, long){
        console.log(lat, long);
        var geocodeApiKey = "AIzaSyCH-kJNjnzgKIsgz699Kj_oBk5NrXMYPUs";
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+long+"&key="+geocodeApiKey;

        return $http.get(url)
            .success(function(data){
                //console.log(data);
                return data;
            })
            .error(function(e){
                return e;
            });
    };

}]);