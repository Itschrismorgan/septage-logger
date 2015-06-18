
septageLogger.service('reportService', [ '$http', function($http){

    this.getCollectionReport = function (beginDate) {
        var url = '/reports/collection-history';
        if(beginDate){
            url = url + '?beginDate='+beginDate;
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