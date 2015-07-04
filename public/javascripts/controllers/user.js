
septageLogger.controller('UserCtrl',['$scope', '$routeParams', '$location', '$anchorScroll', 'userService', 'companyService', 'truckService', 'spreadSiteService', 'logoutService', 'reportService','flash',
    function($scope, $routeParams, $location, $anchorScroll, userService, companyService, truckService, spreadSiteService, logoutService, reportService, flash){

    $scope.$watch('selectedUser', function(newSelectedUser){
        console.log(newSelectedUser);
        if(newSelectedUser === "" || newSelectedUser === undefined || newSelectedUser === null){
            // clear out the form inputs
            $scope.newUser = {};
            document.getElementById('username').disabled = false;
            document.getElementById('company').disabled = false;
            $scope.selectedCompany = "";
        } else {
            userService.getUser(newSelectedUser)
                .then(function(returnData){
                    //console.log("I'm here!");
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
                    document.getElementById('username').disabled = true;
                    document.getElementById('company').disabled = true;
                    
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
            $scope.report = {};
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
            //reloadCollectionList();
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
                    fillApprovedDriversList();
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
        //$location.hash('scrollhere');
        $anchorScroll();
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
                addFlash('company created!');
                clearCompanyFields();
                fillCompanyList();
            }, function(error){
                console.log("error");
            });
    };

    $scope.submitTruck = function(){
        var truckVins = [];
        var truck = $scope.newTruck;
        truck.company = $scope.selectedCompany;
        truck.approvedDrivers = [];
        for(var username in $scope.approvedDrivers.usernames){
            if($scope.approvedDrivers.usernames[username]){
                truck.approvedDrivers.push(username);
            }
        }
        
        $scope.trucks.forEach(function(element){
            truckVins.push(element._id);
        });
        
        if(truckVins.indexOf($scope.newTruck.vin) !== -1){
            truckService.updateTruck(truck)
            .then(function(data){
                addFlash('truck updated!');
                clearTruckFields();
                reloadTruckList();
            }, function(error){
                console.log("error");
            });
        }
        else {
            console.log("create truck");
            truckService.createTruck(truck)
            .then(function(data){
                console.log("truck created");
                addFlash('truck created!');
                clearTruckFields();
                reloadTruckList();
            }, function(error){
                console.log("error:" + error);
            });
        }
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
                    addFlash('user updated!');
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
                    addFlash('user created!');
                    fillInUserList();
                    fillApprovedDriversList();
                    clearFields();
                }, function(error){
                    console.log("problem");
                });
        }
    };

    $scope.submitSpreadSite = function(){
        var spreadSite = $scope.spreadSiteForm;

        spreadSite.approvedCompanies = [];
        console.log($scope.approvedCompanies);
        for(var _id in $scope.approvedCompanies.companies){
            if($scope.approvedCompanies.companies[_id]){
                spreadSite.approvedCompanies.push(_id);
            }
        }
        if (spreadSite._id){
            spreadSiteService.updateSpreadSite(spreadSite)
            .then(function(data){
                //console.log(data);
                addFlash('spreadsite updated!');
                clearSpreadSiteFields();
                reloadSpreadSiteList();
            }, function(error){
                console.log("error");
            });
        } else {
        
        spreadSiteService.createSpreadSite(spreadSite)
            .then(function(data){
                //console.log(data);
                addFlash('spreadsite created!');
                clearSpreadSiteFields();
                reloadSpreadSiteList();
            }, function(error){
                console.log("error");
            });
        }
    };

    $scope.editSite = function(spreadSite){
        //console.log("editSite");
        //console.log(spreadSite)
        $scope.spreadSiteForm = spreadSite;
        $scope.approvedCompanies.companies = {};
        for (var i=0; i < spreadSite.approvedCompanies.length; i++){
            console.log(spreadSite.approvedCompanies[i]);
                $scope.approvedCompanies.companies[spreadSite.approvedCompanies[i]._id] = true;
            }
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
                    //console.log(truck);
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

    function reloadCollectionList(){
        $scope.collections = [];
        reportService.getCollectionReport()
            .then(function(response){
                response.data.map(function(collection){
                    $scope.collections.push(collection);
                });
            }, function(error){
                console.log(error);
            });
    }

    $scope.refreshReport = function(){
        $scope.collections = [];
        //console.log("launch");
        //console.log($scope.report.beginDate);
        if (!$scope.report.beginDate){
            $scope.report.beginDate = new Date(new Date().setDate(new Date().getDate()-30));
        }
        if (!$scope.report.endDate){
            $scope.report.endDate = new Date();
        }
        reportService.getCollectionReport($scope.report.beginDate.toISOString(), $scope.report.endDate.toISOString())
            .then(function(response){
                response.data.map(function(collection){
                    $scope.collections.push(collection);
                });
            }, function(error){
                console.log(error);
            });
    };

    $scope.spreadsiteReport = function(){
        $scope.spreadCollections = [];
        //console.log("launch");
        //console.log($scope.report.beginDate);
        if (!$scope.report.beginDate){
            $scope.report.beginDate = new Date(new Date().setDate(new Date().getDate()-30));
        }
        if (!$scope.report.endDate){
            $scope.report.endDate = new Date();
        }
        reportService.getSpreadsiteReport($scope.report.beginDate.toISOString(), $scope.report.endDate.toISOString())
            .then(function(response){
                response.data.map(function(collection){
                    $scope.spreadCollections.push(collection);
                });
            }, function(error){
                console.log(error);
            });
    };

    function clearCompanyFields(){
        $scope.company = {};
        $scope.company.name = "";
        $scope.company.phone = "";
        $scope.company.active = "";
        $scope.company_form.$setPristine();
    }

    function clearTruckFields(){
        $scope.newTruck = {};
        $scope.selectedCompany = "";
        $scope.newTruck.vin = "";
        $scope.newTruck.capacity = "";
        $scope.newTruck.tag = "";
        $scope.newTruck.nickname = "";
        $scope.newTruck.make = "";
        $scope.newTruck.model = "";
        $scope.newTruck.year = "";
        $scope.newTruck.stat = "";
        $scope.approvedDrivers.usernames = {};
        $scope.truck_form.$setPristine();
    }

    function clearFields(){
        $scope.newUser = {};
        $scope.newUser.username = "";
        $scope.newUser.password = "";
        $scope.newUser.email = "";
        $scope.newUser.type = "";
        $scope.selectedCompany = "";
        $scope.selectedUser = "";
        document.getElementById('username').disabled = false;
        document.getElementById('company').disabled = false;
        $scope.user_form.$setPristine();
    }

    function clearSpreadSiteFields(){
        $scope.spreadSiteForm = {};
        $scope.spreadSiteForm.name = "";
        $scope.spreadSiteForm.address = "";
        $scope.spreadSiteForm.contactName = "";
        $scope.spreadSiteForm.phone = "";
        $scope.spreadsite_form.$setPristine();
    }
    
    function addFlash(message){
        flash(message);
        if (document.getElementById('flash-remove')) {
            document.getElementById('flash-remove').id = 'flash-messages'; 
        }
        setTimeout(function (){
            flash('');
            var flashEl = document.getElementById('flash-messages');
            flashEl.id = 'flash-remove';
        },3000);
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
                //console.log("login bad");
            }
        );
    }
}]);