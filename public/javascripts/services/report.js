
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
    }
    
    this.getSpreadsiteReport = function (year, spreadsite) {
        var url = '/reports/spreadsite-history';
        if(year){
            url = url + '?parameters=dates&dates[year]='+year;
        }
        if(spreadsite){
            url = url + '&dates[spreadsite]='+spreadsite;
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