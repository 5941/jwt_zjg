define(['jquery', 'angular', 'jsTree', 'ngJsTree', 'service/enumService', 'service/enumFilter','views/forbid/filter/filter'], function () {
    // controller

    return ['$rootScope', '$scope', '$state', '$stateParams', 'UtilService', "$uibModal", '$log', '$timeout', '$compile', "$q", "EnumService","$filter",
        function ($rootScope, $scope, $state, $stateParams, UtilService, $uibModal, $log, $timeout, $compile, $q, EnumService,$filter) {
            $rootScope.$state = $state;
           	$scope.pass_search_types = ["号牌号码", "重点车辆类型", "申请时间"];
           	$scope.pass_search_type = "号牌号码";
           	$scope.datePicker = {};
            $scope.locale = UtilService.rangedate_locale;
           	
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
                    	var tempData = data.data;
                    	var resultStatus = [];
                    	for(var i=0;i<tempData.length;i++){
                    		resultStatus.push({
                    			 "name": [tempData[i].name],
                            	 "desc": tempData[i].desc
                    		});
                    	}
                    	
                    	resultStatus.unshift({
                            "name": "",
                            "desc": "全部"
                        })
                        data.data = resultStatus;
                    }
                },
            ]);

            
            
            var allEnumReady = EnumService.allEnumReady();
            allEnumReady.then(function () {
                $scope.enums = EnumService.enums;
                $scope.refreshTable();
            });

            $scope.passSingleParams = {
            	status: ""
            };

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
           

            $scope.selectDate = function ($event, obj, obj2) {
                $scope.passParams.beginDate = new moment(obj.startDate).format("YYYY-MM-DD");
                $scope.passParams.endDate = new moment(obj.endDate).format("YYYY-MM-DD");
            }


            //单条件搜索（简易搜索）
            $scope.$watch("pass_search_type", function(){
            	$scope.passSingleParams = {
            		status: ""
            	};
            });
            
            $scope.singleSearch = function () {
            	$scope.params1 = $.extend({},$scope.passSingleParams);
                $scope.refreshTable();
            }
            //高级搜索
            $scope.advSearch = function () {
                $scope.params1 = $.extend({}, $scope.passParams);
                $scope.refreshTable();
            }

            //刷新表格
            $scope.refreshTable = function () {
                $scope.dtInstance1.reloadData(function () { }, true);
            };
            

            //表格-通行证
            $scope.dtInstance1 = {};

            //表格选项定义-车辆
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
                    
                    if(params.accessType==""){
                    	params.accessType=null;
                    }
                    
                    if(params.status=="" || !params.status){
                    	params.status = null;
                    }
                    
                    allEnumReady.then(function () {
                        UtilService.httpRequest('jwt_forbid/forbid/card/long_card/page', 'POST', params, onSuccess);
                    })
                },
                "headerCallback": function (header) {
                    $compile(angular.element(header).contents())($scope);
                },
                "rowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                	$('td:not(:last-child)', nRow).unbind('click');
                    $('td:not(:last-child)', nRow).bind('click', function () {
                        UtilService.httpRequest("jwt_forbid/forbid/card/long_card/reviewDetail", "GET", {
                            passCardId: aData.passCardId
                        }, function (data) {
                        	var rData = data.data || {};
                        	$scope.detail = rData;
                        	$scope.detail.passCardId = aData.passCardId;
                        	$scope.detail.status = EnumService.enums["cardStatus"]._info.hash[aData.status];
                            $scope.detail.plateTypeId = EnumService.enums["plateTypeId"]._info.hash[rData.plateTypeId];
	                        $scope.detail.forbidTypeId = EnumService.enums["forbidTypeId"]._info.hash[rData.forbidTypeId];
	                        $scope.detail.plateColorId = EnumService.enums["plateColor"]._info.hash[rData.plateColorId];
	                        $scope.detail.beginDate = new moment(rData.beginDate).format("YYYY/MM/DD");
	                        $scope.detail.endDate = new moment(rData.endDate).format("YYYY/MM/DD");
	                        $scope.detail.accessType = EnumService.enums["accessType"]._info.hash[rData.accessType]||"";
	                        $scope.detail.passTimeRangeValue = aData.passTimeRangeList;
                        });
                        $scope.$apply(function () {
                            $scope.popShow = true;
                        });

                    });
                    return nRow;
                }

            };
            
            
            //列定义-通行证
            $scope.dtColumns1 = [
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
                    sTitle: '通行范围',
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
                    sTitle: '申请时间',
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
					sTitle: "操作",
					mData: null,
					bSortable: false,
					mRender: function(data, type, full, meta) {
						return "<a href='javascript:void(0);' ng-click='goMakeup(\""+data.passCardId+"\")'>补录</a>";
					}
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
            
            
            //补录
            $scope.goMakeup = function(passId){
            	console.log(passId);
            }
            
        }
    ];
});