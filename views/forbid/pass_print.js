define(['jquery', 'angular', 'jsTree', 'ngJsTree', 'service/enumService', 'service/enumFilter','views/forbid/filter/filter'], function () {
    // controller

    return ['$rootScope', '$scope', '$state', '$stateParams', 'UtilService', "$location", '$log', '$timeout', '$compile', "$q", "EnumService","$filter",
        function ($rootScope, $scope, $state, $stateParams, UtilService, $location, $log, $timeout, $compile, $q, EnumService,$filter) {
            $rootScope.$state = $state;
           	$scope.linkBtns = [{
           			typeId: 2,
           			name: "普通货运车辆"
           		},
           		{
           			typeId: 4,
           			name: "危化品车辆"
           		},
           		{
           			typeId: 1,
           			name: "工程车辆"
           		},
           		{
           			typeId: 3,
           			name: "特许车辆"
           		},
           		{
           			typeId: 1,
           			name: "临时通行证"
           		}
           	];
           	$scope.pass_search_types = ["联系电话", "号牌号码", "处理状态"];
           	$scope.pass_search_type = "联系电话";
           	$scope.datePicker = {};
            $scope.locale = UtilService.rangedate_locale;
            
            $scope.goApply = function(item){
            	if(item.name=="临时通行证"){
            		$location.path('/update/forbid/temp_pass/'+item.typeId+"/-1");
            	} else{
            		$location.path('/update/forbid/long_pass/'+item.typeId+"/-1");
            	}
            }
           	
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
                    "data": [
						{
                            "name": "",
                            "desc": "全部"
                        },
                        {//已打印
                            "name": ["TO_PRINT"],
                            "desc": "待打印"
                        },
                        {//已打印
                            "name": ["PRINTED"],
                            "desc": "已打印"
                        }
                    ]
                }
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
                    	params.status = ["TO_PRINT","PRINTED"];
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
	                        
	                        var imgUrl = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496736291059&di=b016b0711d2a7c92ee95a71e4a79e909&imgtype=0&src=http%3A%2F%2Fpic.35pic.com%2Fnormal%2F06%2F09%2F82%2F4247774_210515170385_2.jpg";
	                        $scope.$apply(function () {
	                            $scope.upUrl = imgUrl;
            					$scope.downUrl = imgUrl;
	                        });
	                        
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
						return "<a href='javascript:void(0);' ng-click='printPassByGetData(\"" + data.passCardId + "\")' >打印</a>";
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
            
            
            //预览通行证
            $scope.previewPass = function(){
            	$location.path('/update/forbid/pass_preview/'+$scope.detail.passCardId);
            }
            
            //分页列表中点击打印
            $scope.printPassByGetData = function(passCardId){
            	if(passCardId){
            		UtilService.httpRequest("jwt_forbid/forbid/card/long_card/reviewDetail", "GET", {
                        passCardId: passCardId
                    }, function (data) {
                        var imgUrl = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496736291059&di=b016b0711d2a7c92ee95a71e4a79e909&imgtype=0&src=http%3A%2F%2Fpic.35pic.com%2Fnormal%2F06%2F09%2F82%2F4247774_210515170385_2.jpg";
                        $scope.$apply(function () {
                            $scope.upUrl = imgUrl;
        					$scope.downUrl = imgUrl;
        					$timeout(function(){
        						$scope.printPass();
        					},300);
        					
                        });
                    });
            	}
            }
            
            //打印通行证
            $scope.printPass = function(){
				var el = document.getElementById("passPrint");
				var iframe = document.createElement('IFRAME');
				var doc = null;
				iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
				document.body.appendChild(iframe);
				doc = iframe.contentWindow.document;
				doc.write('<div>' + el.innerHTML + '</div>');
				doc.close();
				iframe.contentWindow.focus();
				iframe.contentWindow.print();
				if (navigator.userAgent.indexOf("MSIE") > 0)
				{
				     document.body.removeChild(iframe);
				}            	
            }

        }
    ];
});