define(['jquery', 'angular', 'jsTree', 'ngJsTree', 'service/enumService', 'service/enumFilter','views/forbid/filter/filter','views/forbid/directive/passTimeRange','views/forbid/directive/timeRangeSlider'], function () {
    // controller

    return ['$rootScope', '$scope', '$state', '$stateParams', 'UtilService', "$uibModal", '$log', '$timeout', '$compile', "$q", "EnumService","$filter",
        function ($rootScope, $scope, $state, $stateParams, UtilService, $uibModal, $log, $timeout, $compile, $q, EnumService,$filter) {
            $rootScope.$state = $state;
            
            $scope.locale = UtilService.rangedate_locale;
            $scope.reviewDes = '';
           	$scope.pass_search_types = ["号牌号码", "重点车辆类型", "申请时间"];
           	$scope.pass_search_type = "号牌号码";
            $scope.reviewStatus={'JOINT':'会审中', 'NO_OBJECTION':'无异议', 'PROBLEM_FEEDBACK':'问题反馈'}
            $scope.auditorName='';
            $scope.passPeriodData = {
                
            };
           	$scope.selectPassSearchType = function (data) {
                $scope.pass_search_type = data;
            }
           	//无异议弹框
            $scope.doNoQuestion=function(){
                $scope.showDialogBg=true;
                $scope.showNoQuestion=true;
            }
            //关闭无异议弹框
            $scope.closeNoQuestion=function(){
                $scope.showDialogBg=false;
                $scope.showNoQuestion=false;
                $scope.reviewDes = '';
            }
            //确认无异议
            $scope.doSureNoQuestion=function(){
                $scope.data = {
                    passCardId:$scope.detail.passCardId,
                    reviewId:$scope.detail.reviewId,
                    reviewStatus:'NO_OBJECTION',
                    reviewNotice:$scope.reviewDes
                }
                UtilService.httpRequest('jwt_forbid/forbid/card/long_card/reviewApproval','GET',$scope.data,function(data){
                    UtilService.toastSuccess('操作成功!');
                    $scope.closeNoQuestion();
                    $scope.reloadDetail($scope.detail.passCardId);

                })
            }
            //打开问题反馈
            $scope.openFeedBack=function(){
                $scope.feedbackOpen=true;
            }
            $scope.closeFeedBack=function(){
                $scope.feedbackOpen=false;
                $scope.startAdvice=true;
                $scope.endAdvice=true;
                $scope.areaAdvice=true;
            }
            //添加意见
            $scope.addAdvice = function(num){
                $scope.indexNum=num;
            }

            //审批数据
            $scope.approveData={
                "advice": "",
                "auditor": null,
                "cardId": '',
                "cardStatus": "",
                "oldAuditor": null,
                "passDate":'',
                "plate": ''
            };
            //打开审批弹窗
            $scope.openApprove = function(status){
                $scope.approveData={
                    "cardId": $scope.detail.passCardId,
                    "cardStatus": status,
                    "oldAuditor": $scope.detail.auditor||null,
                    "passDate": $scope.myBeginDate.format('yyyy-MM-dd')+'-'+$scope.myEndDate.format('yyyy-MM-dd'),
                    "plate": $scope.detail.plate
                }
                $scope.showDialogBg=true;
                $scope.showApprove=true;
            }
            //关闭审批弹窗
            $scope.closeApprove = function(){
                $scope.showDialogBg=false;
                $scope.showApprove=false;
                $scope.approveData={
                    "advice": "",
                    "auditor": null,
                    "cardId": '',
                    "cardStatus": "",
                    "oldAuditor": null,
                    "passDate":'',
                    "plate": ''
                };
            }
            //选择转交人
            $scope.selectPerson = function($item){
                $scope.auditorName=$item.personName;
                $scope.approveData.auditor=$item.personId;
            }
            //审批
            $scope.approve = function(){
                if($scope.approveData.cardStatus=='IN_REVIEW' && $scope.approveData.auditor==null){
                    UtilService.toastError('转交人不可为空');
                    return;
                }
                UtilService.httpRequest('jwt_forbid/forbid/permit/deliver/long_card','PUT',$scope.approveData,function(data){
                    UtilService.toastSuccess('操作成功!');
                    $scope.closeApprove();
                })
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
            	$scope.passSingleParams = {};
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
                accessType: null//数据来源
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
	                accessType: null//数据来源
                }
            }
            
            //高级搜索
            $scope.advSearch = function () {
                $scope.params1 = $.extend({}, $scope.passParams);
                $scope.refreshTable();
            }

            //刷新表格
            $scope.refreshTable = function () {
            	$scope.dtInstance.reloadData(function () { }, true);
                
            };
            


            $scope.reloadDetail = function(id){
                UtilService.httpRequest("jwt_forbid/forbid/card/long_card/reviewDetail", "GET", {
                    passCardId: id
                }, function (data) {
                    safeApply($scope,function(){
                        var rData = data.data || {};
                        $scope.detail = rData;
                        $scope.detail.status = EnumService.enums["cardStatus"]._info.hash[rData.status];
                        $scope.detail.plateType = EnumService.enums["plateTypeId"]._info.hash[rData.plateTypeId];
                        $scope.detail.forbidTypeId = EnumService.enums["forbidTypeId"]._info.hash[rData.forbidTypeId];
                        $scope.detail.plateColorId = EnumService.enums["plateColor"]._info.hash[rData.plateColorId];
                        $scope.detail.beginDate = new moment(rData.beginDate).format("YYYY/MM/DD");
                        $scope.detail.endDate = new moment(rData.endDate).format("YYYY/MM/DD");
                        $scope.detail.accessType = EnumService.enums["accessType"]._info.hash[rData.accessType]||null;
                        $scope.detail.passTimeRangeValue = rData.passTimeRangeList;
                        $scope.myBeginDate=StrToDate(rData.beginDate);
                        $scope.myEndDate=StrToDate(rData.endDate);
                    });
                });
                UtilService.httpRequest('jwt_forbid/forbid/card/long_card/reviewList','GET',{passCardId: id},function(data){
                    $scope.progressDate=data.data
                })
            };
            
            
            
            
            //表格-长期通行证
            $scope.dtInstance = {};

            //表格选项定义-长期通行证
            $scope.dtOptions = {
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
                        pageSize: source.length,
                        queryAuthority:'DEPT',
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
                        $scope.reloadDetail(aData.passCardId);
                        
                        $scope.$apply(function () {
                            $scope.popShow = true;
                        });

                    });
                    return nRow;
                }

            };
            
            //列定义-长期通行证
            $scope.dtColumns = [
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
                    bCanHidden:true,
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
                    bCanHidden:true,
                    mData: "owner",
                    sTitle: '联系人',
                    "sDefaultContent": ""
                },
                {
                    bSortable: false,
                    bCanHidden:true,
                    mData: "phoneNumber",
                    sTitle: '联系电话',
                    "sDefaultContent": ""
                },
                {
                    bSortable: false,
                    bCanHidden:true,
                    mData: "applyTime",
                    sTitle: '申报时间',
                    "sDefaultContent": ""
                },
                {
                    bSortable: false,
                    bCanHidden:true,
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
                    "sDefaultContent": "",
                    mRender: function(data, type, full, meta) {
                        return '<a href="javascript:void(0)">'+data*100+'%</a>'||"";
                    }
                }
            ];
            
            //打开自定义页面
            $scope.openColumnDef = function(){
                UtilService.openColumnDef($scope.dtColumns);
            }

			/**
			 * 关闭弹窗
			 */
            $scope.closePop = function () {
                $scope.popShow = false;
                $scope.closeApprove();
                $scope.closeFeedBack();
                $scope.closeNoQuestion();
            };
            
            

        }
    ];
});