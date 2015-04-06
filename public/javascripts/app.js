var septageLogger = angular.module('septageLogger',['ngRoute']);


septageLogger.controller('MainCtrl',['$scope', function($scope){
}]);

septageLogger.controller('IndexCtrl',['$scope',function($scope){
    $scope.name = 'Free Code Camp';
    
}]);


septageLogger.config(function($routeProvider) {
$routeProvider.
when('/', {
templateUrl: 'javascripts/views/home.html',
controller: 'IndexCtrl'
}).
otherwise('/');
});