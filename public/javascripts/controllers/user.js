
septageLogger.controller('UserCtrl',['$scope', '$routeParams', '$location', 'userService', 'companyService', 'truckService', 'spreadSiteService', 'logoutService',
    function($scope, $routeParams, $location, userService, companyService, truckService, spreadSiteService, logoutService){

    $scope.$watch('selectedUser', function(newSelectedUser){
        if(newSelectedUser === "" || newSelectedUser === undefined){
            // clear out the form inputs
            $scope.newUser = {};
        } else {
            userService.getUser(newSelectedUser)
                .then(function(returnData){
                    console.log(returnData);
                    console.log($scope.newUser);
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
            $scope.approvedCompanies = [];
            if($scope.accountType !== 'admin') {
                $scope.companyList = [];
                $scope.companyList.push(data.data.company);
            } else {
                fillCompanyList();
                reloadSpreadSiteList();
                fillApprovedCompanyList();
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

    $scope.deleteTruck = function(vin){
        truckService.deleteTruck(vin)
            .then(function(data){
                reloadTruckList();
                clearTruckFields();
            }, function(error){
                console.log("problem");
            });
    };
    
    $scope.selectTruck = function(vin){
        $scope.newTruck = {};
        truckService.getTruck(vin)
                .then(function(returnData){
                    //console.log("test");
                    console.log(returnData);
                    $scope.selectedCompany = returnData.data.company;
                    $scope.newTruck.vin = returnData.data._id;
                    $scope.newTruck.capacity = returnData.data.capacity;
                    $scope.newTruck.tag = returnData.data.license;
                    $scope.newTruck.nickname = returnData.data.nickname;
                    $scope.newTruck.make = returnData.data.make;
                    $scope.newTruck.model = returnData.data.model;
                    $scope.newTruck.year = returnData.data.year;
                    $scope.newTruck.color = returnData.data.color;
                    $scope.newTruck.stat = returnData.data.stat;
                    $scope.approvedDrivers.usernames = {};
                    for (var i=0; i < returnData.data.approvedDrivers.length ;i++){
                        $scope.approvedDrivers.usernames[returnData.data.approvedDrivers[i]] = true;
                    }
                    
                }, function(err){
                    console.log("problem");
                });
    };

    $scope.editSpreadSite = function(id){
        spreadSiteService.getSpreadSite(id)
            .then(function(data){
                console.log(data);
               $scope.spreadSiteForm = data.data;
            }, function(error){
                console.log(error);
            });
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
        console.log($scope.approvedDrivers.usernames);
        console.log($scope.approvedDrivers.usernames.length);
        $scope.trucks.forEach(function(element){
            if(element._id === $scope.newTruck.vin){
                truckService.updateTruck(truck)
                .then(function(data){
                    clearTruckFields();
                    reloadTruckList();
                }, function(error){
                    console.log("error");
                });
            }
            else {
                truckService.createTruck(truck)
                .then(function(data){
                    console.log("truck updated");
                    clearTruckFields();
                    reloadTruckList();
                }, function(error){
                    console.log("error");
                });
            }
        });
    };


    $scope.createUser = function(){
        var newUser = $scope.newUser;

        if($scope.userList.indexOf($scope.newUser.username) !== -1 ){
            //console.log("update user");
            newUser.company = $scope.selectedCompany;
            //console.log(newUser);
            userService.updateUser(newUser)
                .then(function(data){
                    console.log("user updated");
                    clearFields();
                }, function(error){
                    console.log("problem");
                });

        } else {
            //console.log("create user");
            //console.log($scope.newUser);
            newUser.company = $scope.selectedCompany;
            //console.log(newUser);
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

    $scope.submitSpreadSite = function(){
        var spreadSite = $scope.spreadSiteForm;

        spreadSite.approvedCompanies = [];
        //console.log($scope);
        for(var _id in $scope.approvedCompanies.companies){
            if($scope.approvedCompanies.companies[_id]){
                spreadSite.approvedCompanies.push(_id);
            }
        }

        spreadSiteService.createSpreadSite(spreadSite)
            .then(function(data){
                //console.log(data);
                clearSpreadSiteFields();
                reloadSpreadSiteList();
            }, function(error){
                console.log("error");
            });
    };

    $scope.editSite = function(spreadSite){
        console.log("editSite");
        console.log(spreadSite)
        $scope.spreadSiteForm = spreadSite;
    };

    function fillApprovedDriversList(){
        $scope.drivers = [];
        userService.getUserList()
            .then(function(list){
                list.data.map(function(driver){
                    //console.log(driver);
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

    function fillApprovedCompanyList(){
        $scope.approvedCompaniesList = [];
        companyService.getCompanyList()
            .then(function(res){
                res.data.map(function(company){
                    $scope.approvedCompaniesList.push(company);
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

    function reloadSpreadSiteList(){
        $scope.spreadSites = [];
        spreadSiteService.getSpreadSiteList()
            .then(function(response){
                response.data.map(function(spreadSite){
                    companyService.getCompanyList()
                        .then(function(res){
                            for(var x=0; x<spreadSite.approvedCompanies.length; x++){
                                for(var y=0; y<res.data.length; y++){
                                    if(spreadSite.approvedCompanies[x] === res.data[y]._id){
                                        spreadSite.approvedCompanies[x] = res.data[y];
                                    }
                                }
                            }

                            $scope.spreadSites.push(spreadSite);
                        }, function(error){
                            console.log(error);
                        });
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
        $scope.newTruck.stat = "";
    }

    function clearFields(){
        $scope.newUser = {};
        $scope.newUser.username = "";
        $scope.newUser.password = "";
        $scope.newUser.email = "";
        $scope.newUser.type = "";
    }

    function clearSpreadSiteFields(){
        $scope.spreadSiteForm = {};
        $scope.spreadSiteForm.name = "";
        $scope.spreadSiteForm.address = "";
        $scope.spreadSiteForm.contactName = "";
        $scope.spreadSiteForm.phone = "";
    }

    //Luke added button control here
    $scope.setButton = function(value){
        $scope.button = value;
    };

    $scope.isButton = function(value){
        return $scope.button === value;
    };
    
    $scope.sendLogout = function(){
        logoutService.logout()
            .then(function(data){
                //console.log("login good");
                //a test
                $location.url("/");
                    }, function(error){
                        console.log("problem");
                    });
            }, function(error){
                //console.log("login bad");
            };
}]);