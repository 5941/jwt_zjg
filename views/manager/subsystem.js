define(['jquery', 'angular', 'jsTree', 'ngJsTree'], function () {
    // controller
    return ['$rootScope', '$scope', '$state', '$log', 'UtilService', '$timeout','$compile','notify',
        function ($rootScope, $scope, $state, $log, UtilService, $timeout,$compile,notify) {
            $rootScope.$state = $state;//页面中的$state的隶属于$rootScope

            //表格
            $scope.dtInstance = {};

            //表格选项定义
            $scope.dtOptions = {
                "processing": true,
                "serverSide": true,
                "order":[[1, 'asc']],
                "autoWidth":true,
                "createdRow":function(row, data, dataIndex) {
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
                    UtilService.httpRequest('framework_common/subsystem', 'GET',
                        {
                            pageNumber: source.start / source.length + 1,
                            pageSize: source.length,
                            orderProperty:source.columns[source.order[0].column].data,
                            orderType:source.order[0].dir.toUpperCase()
                        }, onSuccess);
                },
                "headerCallback":function(header){
                    if (!$scope.headerCompiled) {
                        $scope.headerCompiled = true;
                        $compile(angular.element(header).contents())($scope);
                    }
                },
                "rowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    $('td:not(:first-child):not(:last-child)', nRow).unbind('click');
                    $('td:not(:first-child):not(:last-child)', nRow).bind('click', function () {
                        UtilService.httpRequest('framework_common/subsystem/' + aData.subsystemId, 'GET', {},
                            function (data) {
                                $scope.$apply(function () {
                                    var result  = data.data;
                                    $scope.detail = result;
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
                {sTitle:"序号",mData:"seq","sDefaultContent" : ""},
                {sTitle:"系统代号",mData:"subsystemCode"},
                {sTitle:"系统名称",mData:"subsystemName"},
                {sTitle:"备注",mData:"remark",defaultContent:""},
                {sTitle:"操作",mData:null,bSortable:false,
                    mRender:function (data, type, full, meta) {
                        return "<a href='javascript:void(0);' ng-click='openEdit("+data.subsystemId+")' actionbtn action='manager.subsystem.edit'>编辑</a>"+
                        "<a style='margin-left:10px' href='javascript:void(0);' ng-click='delete("+data.subsystemId+")' actionbtn action='manager.subsystem.delete'>删除</a>";
                    }
                },
            ];  

            //点击进入新增页面
            $scope.openNew = function () {
                $state.go('update.subsystem',{'id':-1});
            };
            //点击进入编辑页面
            $scope.openEdit = function (id) {
                $state.go('update.subsystem',{'id':id});
            };

            //删除
            $scope.delete = function (id) {
                var callback = function(res){
                    if(!res)return;

                    UtilService.httpRequest('framework_common/subsystem/'+id, 'DELETE',{}, function(){
                        $scope.dtInstance.reloadData(function () {}, false);
                    });
                };
                UtilService.confirm("删除确认","确定要删除所选子系统吗？",callback);
            };
        }];
});