define(['jquery', 'angular', 'jsTree', 'ngJsTree', 'service/enumService', 'service/enumFilter','views/forbid/filter/filter','views/forbid/directive/passTimeRange','views/forbid/directive/timeRangeSlider'], function () {
    // controller

    return ['$rootScope', '$scope', '$state', '$stateParams', 'UtilService', "$uibModal", '$log', '$timeout', '$compile', "$q", "EnumService","$filter",
        function ($rootScope, $scope, $state, $stateParams, UtilService, $uibModal, $log, $timeout, $compile, $q, EnumService,$filter) {
            $rootScope.$state = $state;
            
            $scope.passTabs = ["临时通行证","长期通行证"];
            $scope.currentTab = "临时通行证";
            $scope.locale = UtilService.rangedate_locale;
            window._scope=$scope;
            $scope.setTab = function(item){
            	$scope.currentTab = item;
            }
           	
           	$scope.pass_search_types = ["号牌号码", "重点车辆类型", "申请时间"];
           	$scope.pass_search_type = "号牌号码";
           	
           	$scope.selectPassSearchType = function (data) {
                $scope.pass_search_type = data;
            }
           	
           	
            EnumService.addEnum([
            	//号牌种类
                {
                    "name": "plateColor",
                    "keyName": "dataKey",
                    "valueName": "dataValue",
                    "resultName":"data.datas",
                    "url": "jwt_forbid/forbid/configuration/plate_color?pageNumber=1&pageSize=0"
                },
            	//号牌种类
                {
                    "name": "plateTypeId",
                    "keyName": "dataKey",
                    "valueName": "dataValue",
                    "resultName":"data.datas",
                    "url": "jwt_forbid/forbid/configuration/plate_type?pageNumber=1&pageSize=0",
                    "prework": function (data) {
                        data.data.datas.unshift({
                            "dataKey": "",
                            "dataValue": "全部"
                        })
                    }
                },
                //重点车辆类型
                {
                    "name": "forbidTypeId",
                    "keyName": "forbidTypeId",
                    "valueName": "forbidTypeName",
                    "url": "jwt_forbid/forbid/configuration/forbid_type",
                    "prework": function (data) {
                        data.data.unshift({
                            "forbidTypeId": "",
                            "forbidTypeName": "全部"
                        })
                    }
                },
                //数据来源 
                {
                    "name": "accessType",
                    "keyName": "name",
                    "valueName": "desc",
                    "url":"jwt_common/common/info/AccessType",
                    "prework": function (data) {
                        data.data.unshift({
                            "name": "",
                            "desc": "全部"
                        })
                    }
                },
                //处理状态,与后台交互
                {
                    "name": "cardStatus",
                    "keyName": "name",
                    "valueName": "desc",
                    "url":"jwt_common/common/info/CardStatus",
                    "prework": function (data) {
                        data.data.unshift({
                            "name": "",
                            "desc": "全部"
                        })
                    }
                }
            ]);

            
            
            var allEnumReady = EnumService.allEnumReady();
            allEnumReady.then(function () {
                $scope.enums = EnumService.enums;
                $scope.refreshTable();
            });
            
            //简单检索
            $scope.passSingleParams = {
            	plateTypeId:""
            };
            
           	$scope.datePickerSingle = {};
           	$scope.selectDateSingle = function ($event, obj, obj2) {
                $scope.passSingleParams.beginDate = new moment(obj.startDate).format("YYYY-MM-DD");
                $scope.passSingleParams.endDate = new moment(obj.endDate).format("YYYY-MM-DD");
                console.log($scope.passSingleParams);
            	$scope.singleSearch();
           	}
           	
           	//单条件搜索（简易搜索）
            $scope.$watch("pass_search_type", function(){
            	$scope.passSingleParams = {
            		plateTypeId:""
            	};
            });
            
            $scope.singleSearch = function () {
                $scope.params1 = $.extend({},$scope.passSingleParams);
                $scope.refreshTable();
            }
           	
           	//高级检索
           	$scope.datePicker = {};
           	$scope.selectDate = function ($event, obj, obj2) {
                $scope.passParams.beginDate = new moment(obj.startDate).format("YYYY-MM-DD");
                $scope.passParams.endDate = new moment(obj.endDate).format("YYYY-MM-DD");
            }

            //车辆高级检索条件
            $scope.passParams = {
                beginDate: "", //开始时间
                endDate: "",//结束时间
                plateTypeId: "",//号牌种类
                plate: "",//号牌号码
                contact:"", //联系人
                phoneNumber:"",//联系电话
                forbidTypeId: "",//重点车辆类型
                accessType: "",//数据来源
                status: ""//处理状态
            }

			/**
			 * 重置车辆高级检索条件
			 */
            $scope.clearCarParams = function () {
                $scope.datePicker = {};
                //车辆高级检索条件
                $scope.passParams = {
                    beginDate: "", //开始时间
	                endDate: "",//结束时间
	                plateTypeId: "",//号牌种类
	                plate: "",//号牌号码
	                contact:"", //联系人
	                phoneNumber:"",//联系电话
	                forbidTypeId: "",//重点车辆类型
	                accessType: "",//数据来源
	                status: ""//处理状态
                }
            }
            
            //高级搜索
            $scope.advSearch = function () {
                $scope.params1 = $.extend({}, $scope.passParams);
                $scope.refreshTable();
            }

            //刷新表格
            $scope.refreshTable = function () {
            	if($scope.currentTab == "临时通行证"){
            		$scope.dtInstance1.reloadData(function () { }, true);
            	} else{
            		$scope.dtInstance2.reloadData(function () { }, true);
            	}
                
            };
            

            //表格-临时通行证
            $scope.dtInstance1 = {};

            //表格选项定义-临时通行证
            $scope.dtOptions1 = {
                "processing": true,
                "serverSide": true,
                "order": [],
                "autoWidth": true,
                "createdRow": function (row, data, dataIndex) {
                    $('td', row).attr("ng-class", "{table_select_bg:selectedRows[" + data.attendanceClassId + "]}");
                    $compile(angular.element(row).contents())($scope);
                },
                "ajax": function (source, callback, settings) {
                    var onSuccess = function (data) {
                        var result = data.data.datas;
                        result.recordsTotal = data.data.totalRecords;
                        result.recordsFiltered = data.data.totalRecords;
                        callback(result);
                    };
                    var params = {
                        pageNumber: source.start / source.length + 1,
                        pageSize: source.length
                    }
                    $.extend(params, $scope.params1);
                    allEnumReady.then(function () {
                        UtilService.httpRequest('jwt_forbid/forbid/permit/temporary_card/page', 'POST', params, onSuccess);
                    })
                },
                "headerCallback": function (header) {
                    $compile(angular.element(header).contents())($scope);
                },
                "rowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    $(nRow).bind('click', function () {
                        UtilService.httpRequest("jwt_forbid/forbid/card/temp_card/detail", "GET", {
                            passCardId: aData.passCardId
                        }, function (data) {
                        	var rData = data.data || {};
                            $scope.detail = rData;
                            $scope.detail.status = EnumService.enums["cardStatus"]._info.hash[aData.status];
	                        $scope.detail.plateType = EnumService.enums["plateTypeId"]._info.hash[rData.plateTypeId];
	                        $scope.detail.forbidTypeId = EnumService.enums["forbidTypeId"]._info.hash[rData.forbidTypeId];
	                        $scope.detail.plateColorId = EnumService.enums["plateColor"]._info.hash[rData.plateColorId];
	                        $scope.detail.beginDate = new moment(rData.beginDate).format("YYYY/MM/DD");
	                        $scope.detail.endDate = new moment(rData.endDate).format("YYYY/MM/DD");
	                        $scope.detail.accessType = EnumService.enums["accessType"]._info.hash[rData.accessType]||"";
	                        $scope.detail.passTimeRangeValue = [{
	                        	beginTime:rData.beginTime,
	                        	endTime:rData.endTime
	                        }];
                        });
                        
                        $scope.$apply(function () {
                            $scope.popShow = true;
                        });

                    });
                    return nRow;
                }

            };
            
            //列定义-临时通行证
            $scope.dtColumns1 = [
            	{
                    bSortable: false,
                    mData: null,
                    sTitle: '号牌号码',
                    mRender: function(data, type, full, meta) {
                    	var spanClass = "plateColor ";
                    	var colorValue = EnumService.enums["plateColor"]._info.hash[data.plateColorId];
                    	if(colorValue == '黄'){
                    		spanClass += "colorYellow";
                    	} else if(colorValue == '蓝'){
                    		spanClass += "colorBlue";
                    	} else if(colorValue == '白'){
                    		spanClass += "colorWhite";
                    	} else{
                    		spanClass += "colorBlue";
                    	}
						return "<span class='"+spanClass+"'>"+data.plate+"</span>";;
					}
                },
                {
                    bSortable: false,
                    mData: "forbidTypeId",
                    sTitle: '重点车辆类型',
                    mRender: function(data, type, full, meta) {
						return EnumService.enums["forbidTypeId"]._info.hash[data]||"";
					}
                },
                {
                    bSortable: false,
                    mData: null,
                    sTitle: '生效日期',
                    mRender: function(data, type, full, meta) {
						return new moment(data.beginDate).format("YYYY/MM/DD");
					}
                },
                
                {
                    bSortable: false,
                    mData: null,
                    sTitle: '通行时段',
                    mRender: function(data, type, full, meta) {
                    	var obj= [{
                    		beginTime:data.beginTime,
                    		endTime:data.endTime
                    	}];
						return $filter('passTimeRange')(obj);
					}
                },
                {
                    bSortable: false,
                    mData: "passArea",
                    sTitle: '通行路线',
                    "sDefaultContent": ""
                },
                {
                    bSortable: false,
                    mData: "contact",
                    sTitle: '联系人',
                    "sDefaultContent": ""
                },
                {
                    bSortable: false,
                    mData: "phoneNumber",
                    sTitle: '联系电话',
                    "sDefaultContent": ""
                },
                {
                    bSortable: false,
                    mData: "applyTime",
                    sTitle: '申报时间',
                    "sDefaultContent": ""
                },
                {
                    bSortable: false,
                    mData: "accessType",
                    sTitle: '数据来源',
                    mRender: function(data, type, full, meta) {
						return EnumService.enums["accessType"]._info.hash[data]||"";
					}
                },
                {
                    bSortable: false,
                    mData: "status",
                    sTitle: '处理状态',
                    mRender: function(data, type, full, meta) {
						return EnumService.enums["cardStatus"]._info.hash[data]||"";
					}
                }
            ];
            
            
            //表格-长期通行证
            $scope.dtInstance2 = {};

            //表格选项定义-长期通行证
            $scope.dtOptions2 = {
                "processing": true,
                "serverSide": true,
                "order": [],
                "autoWidth": true,
                "createdRow": function (row, data, dataIndex) {
                    $('td', row).attr("ng-class", "{table_select_bg:selectedRows[" + data.attendanceClassId + "]}");
                    $compile(angular.element(row).contents())($scope);
                },
                "ajax": function (source, callback, settings) {
                    var onSuccess = function (data) {
                        var result = data.data.datas;
                        result.recordsTotal = data.data.totalRecords;
                        result.recordsFiltered = data.data.totalRecords;
                        callback(result);
                    };
                    var params = {
                        pageNumber: source.start / source.length + 1,
                        pageSize: source.length
                    }
                    $.extend(params, $scope.params1);
                    allEnumReady.then(function () {
                        UtilService.httpRequest('jwt_forbid/forbid/card/long_card/page', 'POST', params, onSuccess);
                    })
                },
                "headerCallback": function (header) {
                    $compile(angular.element(header).contents())($scope);
                },
                "rowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    $(nRow).bind('click', function () {
                        
                        UtilService.httpRequest("jwt_forbid/forbid/card/long_card/reviewDetail", "GET", {
                            passCardId: aData.passCardId
                        }, function (data) {
                        	var rData = data.data || {};
                        	$scope.longPassDetail = rData;
                        	$scope.detail = rData;
                        	$scope.detail.status = EnumService.enums["cardStatus"]._info.hash[aData.status];
                            $scope.detail.plateType = EnumService.enums["plateTypeId"]._info.hash[rData.plateTypeId];
	                        $scope.detail.forbidTypeId = EnumService.enums["forbidTypeId"]._info.hash[rData.forbidTypeId];
	                        $scope.detail.plateColorId = EnumService.enums["plateColor"]._info.hash[rData.plateColorId];
	                        $scope.detail.beginDate = new moment(rData.beginDate).format("YYYY/MM/DD");
	                        $scope.detail.endDate = new moment(rData.endDate).format("YYYY/MM/DD");
	                        $scope.detail.accessType = EnumService.enums["accessType"]._info.hash[rData.accessType]||"";
	                        $scope.detail.passTimeRangeValue = aData.passTimeRangeList;
	                        $scope.detail.validity = aData.validity;
                        });
                        
                        
                        $scope.$apply(function () {
                            $scope.popShow = true;
                        });

                    });
                    return nRow;
                }

            };
            
            //列定义-长期通行证
            $scope.dtColumns2 = [
            	{
                    bSortable: false,
                    mData:null,
                    sTitle: '号牌号码',
                    mRender: function(data, type, full, meta) {
                    	var spanClass = "plateColor ";
                    	var colorValue = EnumService.enums["plateColor"]._info.hash[data.plateColorId];
                    	if(colorValue == '黄'){
                    		spanClass += "colorYellow";
                    	} else if(colorValue == '蓝'){
                    		spanClass += "colorBlue";
                    	} else if(colorValue == '白'){
                    		spanClass += "colorWhite";
                    	} else{
                    		spanClass += "colorBlue";
                    	}
						return "<span class='"+spanClass+"'>"+data.plate+"</span>";;
					}
                },
                {
                    bSortable: false,
                    mData: "forbidTypeId",
                    sTitle: '重点车辆类型',
                    mRender: function(data, type, full, meta) {
						return EnumService.enums["forbidTypeId"]._info.hash[data]||"";
					}
                },
                {
                    bSortable: false,
                    mData: null,
                    sTitle: '通行时间',
                    mRender: function(data, type, full, meta) {
						return new moment(data.beginDate).format("YYYY/MM/DD") + "-" + new moment(data.endDate).format("YYYY/MM/DD");
					}
                },
                {
                    bSortable: false,
                    mData: null,
                    sTitle: '通行时段',
                    mRender: function(data, type, full, meta) {
						return $filter('passTimeRange')(data.passTimeRangeList);
					}
                },
                {
                    bSortable: false,
                    mData: "passArea",
                    sTitle: '通行路线',
                    "sDefaultContent": ""
                },
                {
                    bSortable: false,
                    mData: "owner",
                    sTitle: '所有人',
                    "sDefaultContent": ""
                },
                {
                    bSortable: false,
                    mData: "phoneNumber",
                    sTitle: '联系电话',
                    "sDefaultContent": ""
                },
                {
                    bSortable: false,
                    mData: "applyTime",
                    sTitle: '申报时间',
                    "sDefaultContent": ""
                },
                {
                    bSortable: false,
                    mData: "accessType",
                    sTitle: '数据来源',
                    mRender: function(data, type, full, meta) {
						return EnumService.enums["accessType"]._info.hash[data]||"";
					}
                },
                {
                    bSortable: false,
                    mData: "status",
                    sTitle: '处理状态',
                    mRender: function(data, type, full, meta) {
						return EnumService.enums["cardStatus"]._info.hash[data]||"";
					}
                },
                {
                    bSortable: false,
                    mData: "progress",
                    sTitle: '会审进度',
                    "sDefaultContent": ""
                }
            ];
            
            //打开自定义页面
            $scope.openColumnDef = function(){
                UtilService.openColumnDef($scope.dtColumns1);
            }

			/**
			 * 关闭弹窗
			 */
            $scope.closePop = function () {
                $scope.popShow = false;
            };
            
            /**
			 * 关闭换发弹窗
			 */
            $scope.closeHistoryPop = function () {
                $scope.popHistoryShow = false;
            };
            
            //返回
            $scope.returnBack = function(){
            	$scope.popHistoryShow = false;
            	$scope.popShow = true;
            }
            
            
            //换发
            
            $scope.passPeriodData = {
            	
            };
            
            $scope.goCardHistory = function(detail){
            	$scope.popShow = false;
            	$scope.popHistoryShow = true;
            	$scope.cardHistoryDetail = detail;
            	if(detail.PassTimeRange && detail.sourceId){
            		$scope.passPeriodData.sourceId= $scope.cardHistoryDetail.PassTimeRange.sourceId;
            	}
            	$scope.getCarHistroy();
            }
            
            $scope.hfstartDate = new Date();
            $scope.hfendDate = new Date();
            $scope.$watch("hfstartDate+hfendDate", function(newValue,oldValue){
            	$scope.calcValidDates();
            });
            
            //查询换发记录
            $scope.getCarHistroy = function(){
            	UtilService.httpRequest('jwt_forbid/forbid/permit/card_history/select', 'GET', {
//					plate:$scope.cardHistoryDetail.plate
					plate:"浙A18541"
	        	}, function(data) {
					$scope.carHistroyRecords = data.data;
	        	});
            }
            
            //计算有效期
            $scope.calcValidDates = function(){
                if($scope.hfstartDate && $scope.hfendDate){
                    var date1= moment($scope.hfstartDate);
                    var date2= moment($scope.hfendDate);
                    $scope.hfvalidDates = date2.diff(date1, "days");
                }
            }
            
            //新增换发
            $scope.addCarHistroy = function(){
            	var params = angular.extend({},$scope.longPassDetail);
            	params.beginDate = $scope.hfstartDate.format('yyyyMMdd');
            	params.endDate = $scope.hfstartDate.format('yyyyMMdd');
            	params.validity  = $scope.hfvalidDates;
            	params.passTimeRangeID  = $scope.passPeriodData.sourceId;
            	
            	//自定义时间段
            	if($scope.passPeriodData.sourceId == "-2"){
            		var rangeList = $scope.passPeriodData.rangeList;
	            	if( rangeList && rangeList.length > 0){
	            		var rangeListStrArray = [];
	            		for(var i=0; i<rangeList.length; i++){
	            			var str = rangeList[i].startTime + "-" + rangeList[i].endTime;
	            			rangeListStrArray.push(str);
	            		}
	            		params.passTimeRangeValue = rangeListStrArray.join(";");
	            	}
            	}
            	params.cardPicRelationList = [];
            	params.passAreaList = [];
            	
            	UtilService.httpRequest('jwt_forbid/forbid/permit/card_history/add', 'POST', params, function(data) {
//					$scope.carHistroyRecords = data.data;
	        	});
            }
            
            //重新申请
            $scope.reApply = function(detail){
            	
            }

        }
    ];
});