var septageLogger = angular.module('septageLogger',['ngRoute']);


septageLogger.controller('MainCtrl',['$scope', function($scope){
}]);

septageLogger.controller('IndexCtrl',['$scope',function($scope){
    $scope.name = 'Free Code Camp';
    
}]);

septageLogger.controller('UserCtrl',['$scope', '$routeParams', 'userService', 'companyService', 'truckService', function($scope, $routeParams, userService, companyService, truckService){

    $scope.$watch('selectedUser', function(newSelectedUser){
        if(newSelectedUser === "" || newSelectedUser === undefined){
            // clear out the form inputs
            $scope.newUser = {};
        } else {
            userService.getUser(newSelectedUser)
            .then(function(returnData){
                //console.log(returnData);
                //console.log($scope.newUser);
                $scope.newUser.username = returnData.data.username;
                $scope.newUser.password = "";
                $scope.newUser.email = returnData.data.email;
                $scope.newUser.type = returnData.data.type;
                $scope.selectedCompany = returnData.data.company;
                if(returnData.data.active){
                    $scope.newUser.active = 'yes';
                } else {
                    $scope.newUser.active = 'no';
                }
            }, function(err){
                console.log("problem");
            });
            
        }
    });
    
    $scope.$watch('selectedCompany', function(newSelectedCompany){
        if(newSelectedCompany === "" || newSelectedCompany === undefined){
            // clear out the form inputs
            $scope.company = {};
        } else {
            companyService.getCompany(newSelectedCompany)
            .then(function(returnData){
                $scope.company.name = returnData.data.name;
                $scope.company.phone = returnData.data.phone;
                if(returnData.data.active){
                    $scope.company.active = 'yes';
                } else {
                    $scope.company.active = 'no';
                }
            }, function(err){
                console.log("problem");
            });
            
        }
    });
    
    $scope.$watch('selectedTruck', function(newSelectedTruck){
        if(newSelectedTruck === "" || newSelectedTruck === undefined){
            // clear out the form inputs
            $scope.truck = {};
        } else {
            truckService.getTruck(newSelectedTruck)
            .then(function(returnData){
                $scope.truck.nickname = returnData.data.nickname;
            }, function(err){
                console.log("problem");
            });
            
        }
    });
    
    userService.getUser($routeParams.username)
        .then(function(data){
            $scope.username = data.data.username;
            $scope.accountType = data.data.type;
            if($scope.accountType !== 'admin') {
                fillInUserList();
                reloadTruckList();
                $scope.companyList = [];
                $scope.companyList.push(data.data.company);
            } else {
                fillInUserList();
                fillCompanyList();
                reloadTruckList();
            }
        }, function(error){
            console.log("problem");
        });
        
        
    $scope.deleteUser = function(){
        if($scope.userList.indexOf($scope.newUser.username) !== -1){
            // send delete request
            userService.deleteUser($scope.newUser.username)
                .then(function(data){
                    fillInUserList();
                    clearFields();
                }, function(error){
                    console.log("problem");
                });
        }
    };

    $scope.submitCompany = function(){
        companyService.createCompany($scope.company)
            .then(function(data){
                console.log(data);
                clearCompanyFields();
                fillCompanyList();
            }, function(error){
                console.log("error");
            });
    };
    
    $scope.submitTruck = function(){
        var truck = $scope.newTruck;
        truck.company = $scope.selectedCompany;
        truckService.createTruck(truck)
            .then(function(data){
                console.log(data);
                clearTruckFields();
                reloadTruckList();
            }, function(error){
               console.log("error"); 
            });
    };

    $scope.deleteTruck = function(vin){
        truckService.deleteTruck(vin)
            .then(function(data){
                reloadTruckList();
                clearTruckFields();
            }, function(error){
                console.log("problem");
            });
    };


    $scope.createUser = function(){
        var newUser = $scope.newUser;

        if($scope.userList.indexOf($scope.newUser.username) !== -1 ){
            //console.log("update user");
            newUser.company = $scope.selectedCompany;
            console.log(newUser);
            userService.updateUser(newUser)
                .then(function(data){
                    //console.log("user updated");
                    clearFields();
                }, function(error){
                    console.log("problem");
                });
            
        } else {
            //console.log("create user");
            //console.log($scope.newUser);
            newUser.company = $scope.selectedCompany;
            console.log(newUser);
            userService.createUser($scope.newUser)
                .then(function(data){
                    //console.log("user created");
                    fillInUserList();
                    clearFields();
                }, function(error){
                    console.log("problem");
                });
        }
    };
    
    function fillCompanyList(){
        $scope.companyList = [];
        companyService.getCompanyList()
            .then(function(res){
                res.data.map(function(company){
                    $scope.companyList.push(company.name);
                });
            }, function(error){
                console.log(error);
            });
    }


    function reloadTruckList(){
        $scope.trucks = [];
        truckService.getTruckList()
            .then(function(response){
                response.data.map(function(truck){
                    $scope.trucks.push(truck);
                });
            }, function(error){
                console.log(error);
            });
    }

    function fillInUserList(){
        $scope.userList = [];
        userService.getUserList()
            .then(function(response){
                //console.log(response);
                response.data.map(function(user){
                    //console.log(user);
                    $scope.userList.push(user._id);    
                    //console.log($scope.userList);
                });
            }, function(error){
                console.log("no users returned");
            });
    }

    function clearCompanyFields(){
        $scope.company = {};
        $scope.company.name = "";
        $scope.company.phone = "";
        $scope.company.active = "";
    }

    function clearTruckFields(){
        $scope.newTruck = {};
        $scope.newTruck.vin = "";
        $scope.newTruck.capacity = "";
        $scope.newTruck.tag = "";
        $scope.newTruck.nickname = "";
        $scope.newTruck.make = "";
        $scope.newTruck.model = "";
        $scope.newTruck.year = "";
    }

    function fillTruckList(){
        $scope.truckList = [];
        truckService.getTruckList()
            .then(function(res){
                res.data.map(function(truck){
                    $scope.truckList.push(truck.nickname);
                });
            }, function(error){});
    }
    
    function clearFields(){
        $scope.newUser = {};
        $scope.newUser.username = "";
        $scope.newUser.password = "";
        $scope.newUser.email = "";
        $scope.newUser.type = "";
    }

    //Luke added button control here
    $scope.setButton = function(value){
        $scope.button = value;
    };

    $scope.isButton = function(value){
        return $scope.button === value;
    };
}]);


septageLogger.controller('DriverCtlr', ['$scope', '$routeParams', '$http', 'truckService', 'userService', function($scope, $routeParams, $http, truckService, userService){

    userService.getUser($routeParams.username)
        .then(function(data){
            $scope.username = data.data.username;
            $scope.accountType = data.data.type;
            $scope.company = data.data.company;
            reloadTruckList();
        }, function(error){
            console.log("problem");
        });


    function reloadTruckList(){
        $scope.truckList = [];
        truckService.getTruckList()
            .then(function(response){
                response.data.map(function(truck){
                    $scope.truckList.push(truck);
                });
            }, function(error){
                console.log(error);
            });
    }
}]);

septageLogger.service('companyService', ['$http', function($http){
    
    
    this.createCompany = function(company){
        return $http.post('/company', company)
            .success(function(data){return data;})
            .error(function(e){return e;});
    };
    
    this.getCompanyList = function(){
        return $http.get('/company')
            .success(function(data){return data;})
            .error(function(e) {return e;});
    };
    
    this.getCompany = function(company){
        return $http.get('/company/'+company)
            .success(function(data){return data;})
            .error(function(e){return e;});
    };
}]);

septageLogger.service('userService', ['$http', function($http){
    this.getUser = function(username){
        //console.log('userService::getUser', username);
        return $http.get('/users/'+username)
            .success(function(data){
                //console.log('user returned');
                //console.log(data);
            })
            .error(function(e){
                return e;
            });
    };
    
    this.createUser = function(user){
        return $http.post('/users',user)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e;
            });
    };
    
    this.updateUser = function(user){
        return $http.post('/users/'+user.username, user)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e;
            });
    };
    
    this.deleteUser = function(username){
        return $http.delete('/users/'+username)
            .success(function(data){
                console.log(data);
            })
            .error(function(e){
                return e;
            });
        
    };
    
    this.getUserList = function(){
        return $http.get('/users')
            .success(function(data){return data;})
            .error(function(e) {return e;});
    };
}]);

septageLogger.service('truckService', ['$http', function($http){
    this.getTruck = function(vin){
        //console.log('userService::getUser', username);
        return $http.get('/trucks/'+vin)
            .success(function(data){
                //console.log('user returned');
                //console.log(data);
            })
            .error(function(e){
                return e;
            });
    };
    
    this.createTruck = function(truck){
        return $http.post('/trucks',truck)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e;
            });
    };
    
    this.updateTruck = function(truck){
        return $http.post('/trucks/'+truck.vin, truck)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e;
            });
    };
    
    this.deleteTruck = function(vin){
        console.log(vin);
        return $http.delete('/trucks/'+vin)
            .success(function(data){
                console.log(data);
            })
            .error(function(e){
                return e;
            });
        
    };
    
    this.getTruckList = function(){
        return $http.get('/trucks')
            .success(function(data){return data;})
            .error(function(e) {return e;});
    };
}]);


septageLogger.controller('LoginCtrl',['$scope', '$location', 'loginService', 'userService', function($scope, $location, loginService, userService){
    $scope.sendLogin = function(){
        loginService.login($scope.login.username, $scope.login.password)
            .then(function(data){
                //console.log("login good");
                $scope.loginResult = "";
                $scope.login.password = "";
                //a test
                userService.getUser($scope.login.username)
                    .then(function(data){
                    $scope.username = data.data.username;
                    $scope.accountType = data.data.type;
                        if ($scope.accountType !== 'driver'){
                            $location.url("/user/"+$scope.login.username);
                        } else {
                            $location.url("/driver/"+$scope.login.username);
                        }
                    }, function(error){
                        console.log("problem");
                    });
            }, function(error){
                //console.log("login bad");
                $scope.login.username = "";
                $scope.login.password = "";
                $scope.loginResult = "has-error";
            });
    };
}]);

septageLogger.service('loginService',['$http', function($http){
    this.login = function(username, password){
        //console.log('loginService::login', username, password);
        return $http.post('/login',{username: username, password: password})
            .success(function(data){
                //console.log('login returned');
                //console.log(data);
                return data;
            })
            .error(function(e){
                return e;
            });
    };
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

