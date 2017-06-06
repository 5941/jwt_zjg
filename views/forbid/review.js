define(['jquery', 'angular', 'jsTree', 'ngJsTree'], function () {
    // controller
    return ['$rootScope', '$scope', '$state', '$log', 'UtilService', '$timeout','$compile','notify',
        function ($rootScope, $scope, $state, $log, UtilService, $timeout,$compile,notify) {

            //获取枚举
            $scope.dataFrom='',$scope.cardStatus='',$scope.reviewStatus='';
            $scope.getEnum=function(key){
                UtilService.httpRequest('framework_common/enum/info/'+key,'GET',null,function(data){
                    var enums='{';
                    for(var i in data.data){
                        enums+='"'+data.data[i].name+'":"'+data.data[i].desc+'",';
                    }
                    enums=enums.substring(0,enums.length-1);
                    enums+='}'
                    if(key=='AccessType'){
                        $scope.dataFrom=JSON.parse(enums);
                    }else if(key=='CardStatus'){
                        $scope.cardStatus=JSON.parse(enums);
                    }else if(key=='ReviewStatus'){
                        $scope.reviewStatus=JSON.parse(enums);
                    }

                })

            };
            $scope.getEnum('AccessType');
            $scope.getEnum('CardStatus');
            $scope.getEnum('ReviewStatus');
            $scope.carTypeObj={'A':'工程车辆','B':'普通货运车辆','C':'特许车辆','D':'危化品车辆'};

            //时间转换
            $scope.timeFormat = function(time){
                time=time+'';
                while(time.length<4){
                    time='0'+time
                }
                return time.substring(0,2)+':'+time.substring(2,4)
            }

            //车辆类型筛选
            $scope.config=null;
            UtilService.httpRequest('jwt_law/test_alcohol/getTestAlcoholParam', 'GET',null, function(data){
                $scope.config=data.data;
                $scope.refreshTable();
            });

            var account = JSON.parse(window.localStorage.getItem('account'));
            $scope.dept =  {text:account.deptName,value:account.deptId};
            $scope.data =  {text:account.deptName,value:account.deptId};
            $scope.params = {
                "subDept":true,
                "levelCode":account.levelCode,
                "endTestValue": "",
                "personCode": "",
                "endDate": "",
                "plate":'',
                "startDate": "",
                "testAddress": "",
                "startTestValue": "",
                "certificateCode":'',
                "carType": "",
                "testAlcoholDataType": null,
            };
            $scope.selectSearchType = function (item) {
                $scope.search_type = item;
                $scope.params = {
                    "subDept":true,
                    "levelCode":'',
                    "endTestValue": "",
                    "personCode": "",
                    "startTestValue": "",
                    "testAlcoholDataType": null,
                };
            };
            $scope.search_type = "号牌号码";
            $scope.search_types = ["申请时间","重点车辆类型","号牌号码"];

            //车辆类型筛选
            UtilService.httpRequest('jwt_common/dictionary/car_type', 'GET',null, function(data){
                $scope.car_types=data.data;
                $scope.car_type = '全部';
                $scope.params.carType = '';

            });
            $scope.selectCarType = function (item) {
                $scope.car_type = item.carTypeName;
                $scope.params.carType = item.carTypeCode;
            };

            $scope.selectStateType = function (item,refresh) {
                $scope.state_type = item.name;
                $scope.params.testAlcoholDataType = item.value;
                if(refresh)$scope.refreshTable();
            };
            $scope.state_types = [
                {
                    name:"未归类",
                    value:"UN_CLASSIFY"
                },{
                    name:"交通违法",
                    value:"TRAFFIC_VIOLATION"
                },{
                    name:"交通事故",
                    value:"TRAFFIC_ACCIDENT"
                }
            ];
            $scope.selectPerson = function($item){
                $scope.params.personCode=$item.personCode;
                $scope.refreshTable();
            }
            // 监听选择树节点事件
            $scope.onTreeSelect = function(){
                $scope.params.levelCode="";
                $scope.params.levelCode = $scope.dept.data.levelCode;
                $scope.refreshTable();
            }
            $scope.onTreeSelect2 = function(){
                $scope.params.levelCode="";
                $scope.params.levelCode = $scope.data.data.levelCode;
            }
            $scope.selectDate = function(data,obj,obj2){
                $scope.params.startDate = obj.startDate.format('YYYY-MM-DD HH:mm:ss');
                $scope.params.endDate = obj.endDate.format('YYYY-MM-DD HH:mm:ss');
            }
            //打开自定义页面
            $scope.openColumnDef = function(){
                UtilService.openColumnDef($scope.dtColumns);
            }

            //刷新表格
            $scope.refreshTable = function () {
                    $scope.dtInstance.reloadData(function () {
                }, true);
            };

            //表格
            $scope.dtInstance = {};

            //表格选项定义
            $scope.dtOptions = {
                "processing": true,
                "serverSide": true,
                "order":[[0,"desc"]],
                "autoWidth":true,
                "createdRow":function(row, data, dataIndex) {
                    $('td', row).attr("ng-class","{table_select_bg:selectedRows["+data.testAlcoholId+"]}");
                    $compile(angular.element(row).contents())($scope);
                },
                "ajax": function (source, callback, settings) {
                    var onSuccess = function (data) {
                        var result = data.data.datas;
                        result.recordsTotal = data.data.totalRecords;
                        result.recordsFiltered = data.data.totalRecords;
                   
                        callback(result);
                    };
                    UtilService.httpRequest('jwt_forbid/forbid/card/long_card/page', 'POST',
                        {
                            pageNumber: source.start / source.length + 1,
                            pageSize: source.length,
                            status:['JOINT'],
                        }, onSuccess);
                },
                "headerCallback":function(header){
                    $compile(angular.element(header).contents())($scope);
                },
                "rowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    $('td', nRow).unbind('click');
                    $('td', nRow).bind('click', function () {
                        UtilService.httpRequest('jwt_law/test_alcohol/testAlcohol/' + aData.testAlcoholId, 'GET', {},
                            function (data) {
                                $scope.$apply(function () {
                                    var result  = data.data;
                                    $scope.detail = result;
                                    if($scope.detail.abnomal=="DISABLE"){
                                        $scope.detail.abnomalName="无异议";
                                    }else if($scope.detail.abnomal=="ENABLE"){
                                        $scope.detail.abnomalName="有异议";
                                    }
                                    if($scope.detail.dataType=="TRAFFIC_VIOLATION"){
                                        $scope.detail.dataTypeName="交通违法";
                                    }else if($scope.detail.dataType=="TRAFFIC_ACCIDENT"){
                                        $scope.detail.dataTypeName="交通事故";
                                    }else{
                                        $scope.detail.dataTypeName="未归档";
                                    }
                                  
                                    $scope.popShow = true;
                                });
                            }
                        );
                    });
                    return nRow;
                }
            };

            $scope.closePop = function(){
                $scope.popShow = false;
            };

            //列定义
            $scope.dtColumns = [
                {sTitle:"号牌号码",mData:null,bCanHidden:false,"sDefaultContent" : "--",mRender:function(data, type, full, meta){
                    
                    return '<div class="plateBox" ng-class="{yellowPlate:'+data.plateColorId+'==\'02\',bluePlate:'+data.plateColorId+'==\'01\'}">'+data.plate+'</div>'
                }},
                {bCanHidden:false,bSortable:false,sTitle:"重点车辆类型","sDefaultContent" : "--",mData:"forbidTypeId",mRender:function(data, type, full, meta){
                    
                    return $scope.carTypeObj[data];
                }},
                {bSortable:false,sTitle:"通行时间",mData:null,bCanHidden:false,"sDefaultContent" : "--",mRender:function(data, type, full, meta){
                    if(data.beginDate==''|| data.beginDate==undefined) return;
                    if(data.endDate==''|| data.endDate==undefined) return;
                    return moment(data.beginDate).format('YYYY/MM/DD')+' - '+moment(data.endDate).format('YYYY/MM/DD');
                }},
                {bSortable:false,sTitle:"通行时段",mData:null,bCanHidden:false,"sDefaultContent" : "--",mRender:function(data, type, full, meta){
                    if(data.passTimeRangeList==''||data.passTimeRangeList==undefined) return;
                    var times='';
                    for(var i in data.passTimeRangeList){
                        times+=$scope.timeFormat(data.passTimeRangeList[i].beginTime)+'-'+$scope.timeFormat(data.passTimeRangeList[i].endTime)+','
                    }
                    return times.substring(0,times.length-1)
                }},
                {bSortable:false,sTitle:"通行路线",mData:"passArea","sDefaultContent" : "--"},
                {sTitle:"联系人",mData:"owner",bCanHidden:false,"sDefaultContent" : "--"},
                {bCanHidden:false,bSortable:false,sTitle:"联系电话",mData:"phoneNumber","sDefaultContent" : "--"},
                {bSortable:false,sTitle:"申报时间",mData:"applyTime","sDefaultContent" : "--"},
                {bSortable:false,sTitle:"数据来源",mData:"accessType","sDefaultContent" : "--",mRender:function(data, type, full, meta){
                    return $scope.dataFrom[data];
                }},
                {bSortable:false,sTitle:"处理状态",mData:"status","sDefaultContent" : "--",mRender:function(data, type, full, meta){
                    return $scope.cardStatus[data];
                }},
                {bSortable:false,sTitle:"会审进度",mData:"progress","sDefaultContent" : "--",mRender:function(data, type, full, meta){
                    
                    return '<a href="javascript:void(0)">'+data*100+'%</a>';
                }},
            ];  
        }];
});