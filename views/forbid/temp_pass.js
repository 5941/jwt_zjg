define(['jquery', 'angular', 'jsTree', 'ngJsTree',
'views/forbid/directive/editForbidRange',
'views/forbid/directive/carDetail',
'views/forbid/directive/comboPassArea',
'views/forbid/directive/comboPoiSearch',
'views/forbid/directive/forbidMap'], function () {
    // controller
    return ['$rootScope', '$scope', '$state', '$log', 'UtilService', '$timeout','$compile','notify','$q',
        function ($rootScope, $scope, $state, $log, UtilService, $timeout,$compile,notify,$q) {
            $scope.cars = [];
            console.log($state.params);
            $scope.data = {};
            $scope.data.passAreas = [];
            $scope.defaultImgUrl = 'views/forbid/img/icon_takephoto.png';

            $scope.tab_view = "range";
            $scope.next_step = "下一步";
            $scope.params1 = [];
            $scope.params2 = {};
            $scope.params3 = {};

            $scope.next = function(){
                
                if($scope.tab_view == "info"){
                    //检查信息完整性
                    $scope.params1 = [];
                    for(var i in $scope.cars){
                        var car = $scope.cars[i];
                        if(!car.plate || car.plate == ""){
                            UtilService.toastError('请输入号牌号码');
                            return;
                        }

                        if(!car.plate_type || car.plate_type.dataValue == ""){
                            UtilService.toastError('请选择号牌种类');
                            return;
                        }

                        if(!car.contact || car.contact == ""){
                            UtilService.toastError('请输入联系人');
                            return;
                        }

                        if(!car.phoneNumber || car.phoneNumber == ""){
                            UtilService.toastError('请输入联系电话');
                            return;
                        }

                        for(var j in car.cardPicRelationList){
                            if(car.cardPicRelationList[j].picUrl == ""){
                                UtilService.toastError('请选择'+car.cardPicRelationList[j].picTypeName);
                                return;
                            }
                        }

                        var param = {
                            accessType:'WINDOW_HANDLE',
                            address:car.address,
                            areaIdList:[],//TODO:通行区域编号
                            auditor:'',//TODO:
                            backPlate:car.backPlate,
                            beginDate:'',
                            cardPicRelationList:car.cardPicRelationList,
                            contact:car.contact,
                            deptIdList:[],
                            endDate:'',
                            forbidTypeId:$state.params.type,
                            phoneNumber:car.phoneNumber,
                            owner:car.owner,
                            plate:car.plate,
                            plateColorId:car.plate_color.plateColorId,
                            plateTypeId:car.plate_type.plateTypeId,
                            status :'',//TODO:
                            validity:0,
                        };
                        $scope.params1.push(param);
                    }
                    console.log($scope.params1);
                    $scope.tab_view = 'time';
                    $scope.next_step = "下一步";
                }else if($scope.tab_view == "time"){
                    if(!$scope.data.beginDate){
                        UtilService.toastError('选择开始日期');
                        return;
                    }
                    $scope.params2.beginDate = moment($scope.data.beginDate).format('YYYY-MM-DD HH:mm:ss');

                    if(!$scope.data.endDate){
                        UtilService.toastError('选择结束日期');
                        return;
                    }
                    $scope.params2.endDate = moment($scope.data.endDate).format('YYYY-MM-DD HH:mm:ss');

                    $scope.params2.validity = $scope.data.validDates;
                    if($scope.params2.validity <= 0){
                        UtilService.toastError('结束日期要在开始日期之后');
                        return;
                    }
                    $scope.tab_view = 'range';
                    $scope.next_step = "提交";
                    $timeout(function(){
                        $scope.forbidAreaMap.init();
                    });
                }else if($scope.tab_view == "range"){
                    var passAreas = [];
                    if(!$scope.data.start){
                        UtilService.toastError('请选择出发地');
                        return;
                    }

                    if(!$scope.data.end){
                        UtilService.toastError('请选择目的地');
                        return;
                    }

                    $scope.deptIdList = [];
                    if($scope.data.needRevice == 'true'){
                        for(var i in $scope.duty_areas){
                            if($scope.duty_areas[i].selected)
                                $scope.deptIdList.push($scope.duty_areas[i].areaDept);
                        }

                        if($scope.deptIdList.length == 0){
                            UtilService.toastError('请选择会审部门');
                            return;
                        }
                    }

                    for(var i in $scope.data.passAreas){
                        var passArea = $scope.data.passAreas[i];
                        if(!passArea.areaRange || passArea.areaRange == ''){
                            UtilService.toastError('请输入通行范围');
                            return;
                        }

                        var param = {
                            areaRange:passArea.areaRange,
                            areaType:passArea.areaType,
                            destLat:$scope.data.end.lat,
                            destLon:$scope.data.end.lng,
                            destName:$scope.data.end.name,
                            facilityIdList:passArea.facilityIdList,
                            pointList:passArea.pointList,
                            srcLat:$scope.data.start.lat,
                            srcLon:$scope.data.start.lng,
                            srcName:$scope.data.start.name,
                            thumbUrl:passArea.thumbUrl,
                            useType:passArea.useType
                        };
                        passAreas.push(param);
                    }

                    //合并参数
                    for(var i in $scope.params1){
                        var param = $scope.params1[i];
                        param.beginDate = $scope.params2.beginDate;
                        param.endDate = $scope.params2.endDate;
                        param.validity = $scope.params2.validity;
                        param.deptIdList = $scope.deptIdList;
                    }
                }

                console.log(passAreas);
            }

            $scope.prior = function(){
                
                if($scope.tab_view == "time"){
                    $scope.tab_view = 'info';
                    $scope.next_step = "下一步";
                }else if($scope.tab_view == "range"){
                    $scope.tab_view = 'time';
                    $scope.next_step = "下一步";
                }
            }

            $scope.save = function(){
               
            }

            $scope.closeCarDetail = function(car){
                car.showCarDetail = false;
            }

            $scope.toShowCarDetail = function(event,car){
                if(!car.plate){
                    UtilService.toastError('请输入车牌号');
                    return;
                }

                if(!car.plate_type || !car.plate_type.dataKey){
                    UtilService.toastError('请选择号牌种类');
                    return;
                }

                event.cancelBubble = true;
                event.stopPropagation();

                car.showCarDetail = true;
                
                //车辆信息查询
                var params = {hphm:car.plate,hpzl:car.plate_type.dataKey};
                UtilService.httpRequest('jwt_forbid/forbid/card/six_veh/detail', 'GET',params, function(data){
                    car.carDetail = data.data;

                    if(car.carDetail.yxqz)
                        car.carDetail.yxqz = moment(car.carDetail.yxqz).format('YYYY/MM/DD');

                    if(car.carDetail.qzbfqz)
                        car.carDetail.qzbfqz = moment(car.carDetail.qzbfqz).format('YYYY/MM/DD');
                });
            };

            $scope.addCar = function(){
                var car = {cardPicRelationList:angular.copy($scope.forbidTypePics)};
                if($scope.plate_types && $scope.plate_types.length>0)
                    car.plate_type = $scope.plate_types[0];

                if($scope.plate_colors && $scope.plate_colors.length>0)
                    car.plate_color = $scope.plate_colors[0];
                $scope.cars.push(car);
            }

            $scope.removeCar = function(index){
                $scope.cars.splice(index,1);
            }

            $scope.loadBaseInfo = function(){
                //查询车辆与图片的配置
                var promise1 = function(){
                    var p = $q.defer();
                    UtilService.httpRequest('jwt_forbid/forbid/configuration/forbid_type', 'GET',null, function(data){
                        $scope.$apply(function(){
                            $scope.forbidTypePics = [];
                            for(var i in data.data){
                                if(data.data[i].forbidTypeId == $state.params.type){
                                    for(var j in data.data[i].forbidPicType){
                                        data.data[i].forbidPicType[j].picUrl = "";
                                        $scope.forbidTypePics.push(data.data[i].forbidPicType[j]);
                                    }
                                }

                                if(data.data[i].forbidTypeId == $state.params.type){
                                    $scope.forbidType = data.data[i];
                                }
                            }
                            p.resolve();
                        });
                    });

                    return p.promise;
                };
                

                //车牌种类
                var promise2 = function(){
                    var p = $q.defer();
                    UtilService.httpRequest('jwt_forbid/forbid/configuration/plate_type', 'GET',{pageNumber:1,pageSize:100}, function(data){
                        $scope.$apply(function(){
                            //$scope.plate_types=[{dataKey:'0',dataValue:'dddd'},{dataKey:'0',dataValue:'eee'}];//data.data;
                            $scope.plate_types = data.data.datas;
                            p.resolve();
                        })
                    });
                    return p.promise;
                };

                //车牌颜色
                var promise3 = function(){
                    var p = $q.defer();
                    UtilService.httpRequest('jwt_forbid/forbid/configuration/plate_color', 'GET',{pageNumber:1,pageSize:100}, function(data){
                        $scope.$apply(function(){
                            $scope.plate_colors=data.data.datas;
                            p.resolve();
                        })
                    });
                    return p.promise;
                };

                //责任区
                var promise4 = function(){
                    var p = $q.defer();
                    UtilService.httpRequest('jwt_forbid/forbid/configuration/forbid_duty_area', 'GET',{pageNumber:1,pageSize:100}, function(data){
                        $scope.$apply(function(){
                            $scope.duty_areas=data.data.datas;
                            console.log($scope.duty_areas);
                            p.resolve();
                        })
                    });
                    return p.promise;
                };
                return $q.all([promise1(),promise2(),promise4(),promise3()]);
            };

            $scope.checkCar = function(car){
                if(!car.forbidTypeName){
                    UtilService.toastError('请输入重点车辆类型');
                    return;
                }

                if(!car.plate){
                    UtilService.toastError('请输入号牌号码');
                    return;
                }

                if(!car.plate_type){
                    UtilService.toastError('请选择号牌种类');
                    return;
                }

                if(!car.contact){
                    UtilService.toastError('请输入联系人');
                    return;
                }

                if(!car.phoneNumber){
                    UtilService.toastError('请输入联系电话');
                    return;
                }
            }

            $scope.showEditForbidRange = false;
            $scope.closeEditForbidRange = function(data){
                $scope.showEditForbidRange = false;
                $scope.showPassAreaIcon();
            }

            $scope.getEnumByKey = function(enums,key){
                for(var i in enums){
                    if(enums[i].dataKey == key){
                        return enums[i];
                    }
                }
            }

            $scope.getForbidTypeById = function(id){

            }

            $scope.loadBaseInfo().then(function(){
                return $scope.loadPassInfo();
            }).then(function(){
                if($scope.cars.length == 0)$scope.addCar();
                
                $scope.data.needRevice = 'false';

                if($scope.data.passAreas.length == 0)$scope.addDefPassArea();
            });

            //加载长期通行证详细信息
            $scope.loadPassInfo = function(){
               
                var promise = function(){
                    var p = $q.defer();
                    if($state.params.id < 0){
                        p.resolve();
                        return p.promise;
                    }
                    var params = {"pageNumber": 1,"pageSize": 10};
                    UtilService.httpRequest('jwt_forbid/forbid/card/long_card/page', 'POST',params, function(data){
                        var passCard = data.data.datas[0];
                        //车辆信息
                        passCard.plate_color = $scope.getEnumByKey($scope.plate_colors,passCard.plateColorId);
                        passCard.plate_type = $scope.getEnumByKey($scope.plate_types,passCard.plateTypeId);
                        

                        //合并照片配置
                        for(var i in $scope.forbidTypePics){

                            var pic = $scope.forbidTypePics[i];
                            var exists = false;
                            for(var j in passCard.cardPicRelationList){
                                if(passCard.cardPicRelationList[j].picTypeId == pic.picTypeId)
                                    exists = true;
                            }
                            if(!exists){
                                passCard.cardPicRelationList.push(pic);
                            }    
                        }
                        $scope.cars.push(passCard);

                        //时间范围
                        $scope.data.beginDate = moment(passCard.beginDate).toDate();
                        $scope.data.endDate = moment(passCard.endDate).toDate();
                        $scope.calcValidDates();

                        //通行范围
                        if(passCard.passAreaList.length>0){
                            var passArea = passCard.passAreaList[0];
                            $scope.data.start = {lat:passArea.srcLat,lng:passArea.srcLon,name:passArea.srcName};
                            $scope.data.end = {lat:passArea.destLat,lng:passArea.destLon,name:passArea.destName};
                        }

                        $scope.data.passAreas = passCard.passAreaList;
                        p.resolve();
                    });

                    return p.promise;
                };

                return $q.all([promise()]);
            }

            $scope.data.validDates = 0;
            $scope.calcValidDates = function(){
                if($scope.data.beginDate && $scope.data.endDate){
                    var date1= moment($scope.data.beginDate);
                    var date2= moment($scope.data.endDate);
                    $scope.data.validDates = date2.diff(date1, "days");
                }
            }
            $scope.$watch('data.beginDate',function(newValue,oldValue){
                $scope.calcValidDates();
            });

            $scope.$watch('data.endDate',function(newValue,oldValue){
                $scope.calcValidDates();
            });

            $scope.showPassAreaIcon = function(){
                for(var i in $scope.data.passAreas){
                    var passArea = $scope.data.passAreas[i];
                    passArea.showIcon = parseInt(i) < $scope.data.passAreas.length - 1;
                }
            }

            $scope.addDefPassArea = function(){
                $scope.data.passAreas.push({pointList:'[]',facilityIdList:[],useType:'TEMP',areaType:'BROKEN_LINE'});
                $scope.showPassAreaIcon();
            }
            $scope.deletePassArea = function(index){
                $scope.data.passAreas.splice(index,1);
            }

            $scope.selectStart = function(data){
                console.log(data);
            }

            $scope.selectEnd = function(data){
                console.log(data);
            }

            $scope.selectPassArea = function(data){
                console.log(data);
            }

            $scope.selectAllDutyArea = function(){
                for(var i in $scope.duty_areas){
                    $scope.duty_areas[i].selected = true;
                }
            }

            $scope.toggleSelectDutyArea = function(){
                $scope.allDutyAreaSelect = true;
                for(var i in $scope.duty_areas){
                    $scope.allDutyAreaSelect = $scope.allDutyAreaSelect && $scope.duty_areas[i].selected;
                }
            }

            $timeout(function(){
                $scope.forbidMap.init();
            });
        }];
});