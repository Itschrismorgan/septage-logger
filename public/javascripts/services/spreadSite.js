/**
 * Created by chrismorgan on 5/26/15.
 */
septageLogger.service('spreadSiteService', ['$http', function($http){
    this.getSpreadSite = function(_id){
        //console.log('userService::getUser', username);
        return $http.get('/spreadsites/'+_id)
            .success(function(data){
                //console.log('user returned');
                //console.log(data);
            })
            .error(function(e){
                return e;
            });
    };

    this.createSpreadSite = function(spreadSite){
        return $http.post('/spreadsites',spreadSite)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e;
            });
    };

    this.updateSpreadSite = function(spreadSite){
        return $http.post('/spreadsites/'+spreadSite._id, spreadSite)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e;
            });
    };

    this.deleteSpreadSite = function(_id){
        console.log(_id);
        return $http.delete('/spreadsites/'+_id)
            .success(function(data){
                console.log(data);
            })
            .error(function(e){
                return e;
            });

    };

    this.getSpreadSiteList = function(){
        return $http.get('/spreadsites')
            .success(function(data){
                return data;
            })
            .error(function(e) {
                return e;
            });
    };
}]);