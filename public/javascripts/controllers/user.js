
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
            $scope.approvedDrivers = [];
            if($scope.accountType !== 'admin') {
                $scope.companyList = [];
                $scope.companyList.push(data.data.company);
            } else {
                fillCompanyList();
            }

            fillInUserList();
            reloadTruckList();
            fillApprovedDriversList();
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
        truck.approvedDrivers = [];
        for(var username in $scope.approvedDrivers.usernames){
            if($scope.approvedDrivers.usernames[username]){
                truck.approvedDrivers.push(username);
            }
        }

        truckService.createTruck(truck)
            .then(function(data){
                //console.log(data);
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

    function fillApprovedDriversList(){
        $scope.drivers = [];
        userService.getUserList()
            .then(function(list){
                list.data.map(function(driver){
                    console.log(driver);
                    $scope.drivers.push(driver._id);
                })
            }, function(error){
                console.log(error);
            });
    }

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