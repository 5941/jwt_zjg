define(['jquery', 'angular', 'jsTree', 'ngJsTree'], function () {
    // controller
    return ['$rootScope', '$scope', '$state', '$log', 'UtilService', '$timeout', '$compile', 'notify',
        function ($rootScope, $scope, $state, $log, UtilService, $timeout, $compile, notify) {
            $rootScope.$state = $state;//页面中的$state的隶属于$rootScope

            //表格
            $scope.dtInstance = {};

            //表格选项定义
            $scope.dtOptions = {
                "processing": true,
                "serverSide": true,
                "order": [[1, 'asc']],
                "autoWidth": true,
                "createdRow": function (row, data, dataIndex) {
                    $compile(angular.element(row).contents())($scope);
                },
                "ajax": function (source, callback, settings) {
                    console.log(source);
                    var onSuccess = function (data) {
                        var result = data.data.datas;

                        result.recordsTotal = data.data.totalRecords;
                        result.recordsFiltered = data.data.totalRecords;
                        $scope.allSelected = false;
                        $scope.selectedRows = [];
                        callback(result);
                    };
                    UtilService.httpRequest('framework_common/module', 'GET',
                        {
                            pageNumber: source.start / source.length + 1,
                            pageSize: source.length,
                            orderProperty: source.columns[source.order[0].column].data,
                            orderType: source.order[0].dir.toUpperCase()
                        }, onSuccess);
                },
                "headerCallback": function (header) {
                    if (!$scope.headerCompiled) {
                        $scope.headerCompiled = true;
                        $compile(angular.element(header).contents())($scope);
                    }
                },
                "rowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    $('td:not(:first-child):not(:last-child)', nRow).unbind('click');
                    $('td:not(:first-child):not(:last-child)', nRow).bind('click', function () {
                        UtilService.httpRequest('framework_common/module/' + aData.moduleId, 'GET', {},
                            function (data) {
                                $scope.$apply(function () {
                                    var result = data.data;
                                    $scope.detail = result;
                                    $scope.detail.moduleStatus = {
                                        'NORMAL': '正常',
                                        'DEVELOPMENT': '开发中',
                                        'MAINTENANCE': '维护中'
                                    }[$scope.detail.moduleStatus];
                                    $scope.detail.supportDataRule = {
                                        "FALSE": "否",
                                        "TRUE": "是"
                                    }[$scope.detail.supportDataRule]
                                    $scope.detail.supportOffline = {
                                        "FALSE": "否",
                                        "TRUE": "是"
                                    }[$scope.detail.supportOffline]
                                    $scope.detail.moduleType = {
                                        'BOTH': '全部',
                                        'APP': 'APP',
                                        'WEB': 'WEB'
                                    }[$scope.detail.moduleType]
                                    $scope.popShow = true;
                                });
                            }
                        );
                    });
                    return nRow;
                }
            };

            $scope.closePop = function () {
                $scope.popShow = false;
            };

            //列定义
            $scope.dtColumns = [
                {sTitle: "序号", mData: "seq","sDefaultContent" : ""},
                {sTitle: "子系统编码", mData: "subsystemCode","sDefaultContent" : ""},
                {sTitle: "子系统名称", mData: "subsystemName","sDefaultContent" : ""},
                {sTitle: "模块编码", mData: "moduleCode","sDefaultContent" : ""},
                {sTitle: "模块名称", mData: "moduleName","sDefaultContent" : ""},
                {
                    sTitle: "模块类型", mData: "moduleType", mRender: function (data, type, full, meta) {
                    return {'BOTH': '全部', 'APP': 'APP', 'WEB': 'WEB'}[data];
                }
                },
                /*{sTitle:"模块状态",mData:"moduleStatus",mRender:function(data, type, full, meta){
                 return {'NORMAL':'正常','DEVELOPMENT':'开发中','MAINTENANCE':'维护中'}[data];
                 }},
                 {sTitle:"支持数据权限",mData:"supportDataRule",mRender:function(data, type, full, meta){
                 return {"FALSE":"否","TRUE":"是"}[data];
                 }},
                 {sTitle:"支持离线",mData:"supportOffline",mRender:function(data, type, full, meta){
                 return {"FALSE":"否","TRUE":"是"}[data];
                 }},
                 {sTitle:"备注",mData:"remark",defaultContent:""},*/
                {
                    sTitle: "操作", mData: null, bSortable: false,
                    mRender: function (data, type, full, meta) {
                        return "<a href='javascript:void(0);' ng-click='openEdit(" + data.moduleId + ")' actionbtn action='manager.module.edit'>编辑</a>" +
                            "<a style='margin-left:10px' href='javascript:void(0);' ng-click='delete(" + data.moduleId + ")' actionbtn action='manager.module.delete'>删除</a>" +
                            "<a style='margin-left:10px' href='javascript:void(0);' ng-click= menu(" + data.moduleId+",'"+data.moduleCode + "') actionbtn action='manager.module.menu'>菜单</a>";
                    }
                },
            ];

            //点击进入新增页面
            $scope.openNew = function () {
                $state.go('update.module', {'id': -1});
            };
            //点击进入编辑页面
            $scope.openEdit = function (id) {
                $state.go('update.module', {'id': id});
            };

            //删除
            $scope.delete = function (id) {
                var callback = function (res) {
                    if (!res)return;

                    UtilService.httpRequest('framework_common/module/' + id, 'DELETE', {}, function () {
                        $scope.dtInstance.reloadData(function () {
                        }, false);
                    });
                };
                UtilService.confirm("删除确认", "确定要删除所选子系统吗？", callback);
            };
            //点击进入菜单
            $scope.menu = function (id,code) {
                if(code && code.length !== 0){
                    $state.go('main.menu',{'id':id,'code':code});
                }
            }
        }];
});