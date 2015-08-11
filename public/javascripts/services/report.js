
septageLogger.service('reportService', [ '$http', function($http){

    this.getCollectionReport = function (beginDate, endDate) {
        var url = '/reports/collection-history';
        if(beginDate){
            url = url + '?parameters=dates&dates[beginDate]='+beginDate;
        }
        if(endDate){
            url = url + '&dates[endDate]='+endDate;
        }
        console.log(url);

        return $http.get(url)
            .success(function(data){
                //console.log(data);
            })
            .error(function(e){
                return e;
            });
    };
    
    this.getSpreadsiteReport = function (beginDate, endDate) {
        var url = '/reports/spreadsite-history';
        if(beginDate){
            url = url + '?parameters=dates&dates[beginDate]='+beginDate;
        }
        if(endDate){
            url = url + '&dates[endDate]='+endDate;
        }
        console.log(url);

        return $http.get(url)
            .success(function(data){
                //console.log(data);
            })
            .error(function(e){
                return e;
            });
    }
}]);