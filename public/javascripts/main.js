var septageLogger = angular.module('septageLogger',['ngRoute', 'uiGmapgoogle-maps']);
//var septageLogger = angular.module('septageLogger',['ngRoute']);


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
when('/login', {
   templateUrl: 'javascripts/views/login.html',
   controller: 'LoginCtrl'
}).
when('/user/:username',{
    templateUrl: 'javascripts/views/user.html',
    controller: 'UserCtrl'
}).
when('/driver/:username',{
    templateUrl: 'javascripts/views/driver.html',
    controller: 'DriverCtlr'
}).
otherwise('/');
});

