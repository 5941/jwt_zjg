define(['jquery', 'angular', 'jsTree', 'ngJsTree'], function () {
    // controller
    return ['$rootScope', '$scope', '$state', '$log', 'UtilService', '$timeout','$compile','notify',
        function ($rootScope, $scope, $state, $log, UtilService, $timeout,$compile,notify) {
            $scope.data = {};

            //条件输入区域的变量值
            $scope.inputs = {
                accountCode: "",
                accountName: "",
                phone: "",
                selectSexual: "",
                accountKindId: "",
                check_subDept: true
            };
            
            // 监听选择树节点事件
            $scope.onTreeSelect = function(){
                $scope.inputs = {check_subDept: true};
                $scope.select_node_id = $scope.deptnode.deptId;
                $scope.refreshTable();
           }

            $scope.selectSearchType = function (item) {
                $scope.search_type = item;
                $scope.keywords = "";
            };

            $scope.myKeyup = function(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    $scope.refreshTable();
                }
            };

            $scope.search_type = "用户";

            $scope.selectSexType = function (item) {
                $scope.sex_type = item;
            };
            $scope.sex_type = "男";
            $scope.sex_types = ["男", "女"];

            //构建角色菜单树
            $scope.treeConfig = UtilService.getDefaultTreeConfig();
            $scope.buildTree = function(){
                //获取用户的权限信息
                UtilService.httpRequest('framework_common/permission/use_rule', 'GET', {accountId:$scope.detail.accountId},function(data2){
                    var treeData = [];
                    console.log(data2);
                    //加入模块信息
                    for (var i in data2.data.modules) {
                        var data = data2.data.modules[i];
                        treeData.push({
                            "id": data.moduleId,
                            "parent": '#',
                            "text": data.moduleName,
                            "state": {
                                "opened": true
                            }
                        });
                    }
                    // 加入菜单信息
                    for (var i in data2.data.menus) {
                        var data = data2.data.menus[i];
                        treeData.push({
                            "id": data.menuId,
                            "parent": data.parentMenuId == undefined?data.moduleId:data.parentMenuId,
                            "text": data.menuName,
                            "state": {
                                "opened": true
                            }
                        });
                    }
                    
                    // 加入操作信息
                    for (var i in data2.data.actions) {
                        var data = data2.data.actions[i];
                        treeData.push({
                            "id": data.actionId,
                            "parent": data.menuId,
                            "text": data.actionName,
                            "state": {
                                "opened": false
                            }
                        });
                    }
                    console.log(treeData);

                    $scope.$apply(function(){
                        $scope.treeData = treeData;
                        $scope.treeConfig.version++;
                    });
                });
            };

            //点击进入新增页面
            $scope.openNew = function () {
                $state.go('update.account',{'id':-1,deptId:$scope.deptnode.deptId});
            };
            //点击进入编辑页面
            $scope.openEdit = function (id) {
                $state.go('update.account',{'id':id});
            };

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
                "order":[[2,"desc"]],
                "autoWidth":true,
                "createdRow":function(row, data, dataIndex) {
                    $('td', row).attr("ng-class","{table_select_bg:selectedRows["+data.accountId+"]}");
                    $compile(angular.element(row).contents())($scope);
                },
                "ajax": function (source, callback, settings) {
                    var onSuccess = function (data) {
                        var result = data.data.datas;
                        result.recordsTotal = data.data.totalRecords;
                        result.recordsFiltered = data.data.totalRecords;
                        $scope.allSelected = false;
                        $scope.selectedRows = [];
                        callback(result);
                    };
                    UtilService.httpRequest('framework_common/account', 'GET',
                        {
                            pageNumber: source.start / source.length + 1,
                            pageSize: source.length,
                            deptId: $scope.select_node_id || "",
                            accountCodeOrName: $scope.inputs.accountCode || "",
                            subDept: $scope.inputs.check_subDept,
                            orderProperty:source.order.length==0?null:source.columns[source.order[0].column].data,
                            orderType:source.order.length==0?null:source.order[0].dir.toUpperCase()
                        }, onSuccess);
                },
                "headerCallback":function(header){
                    $compile(angular.element(header).contents())($scope);
                },
                "rowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    $('td:not(:first-child):not(:last-child)', nRow).unbind('click');
                    $('td:not(:first-child):not(:last-child)', nRow).bind('click', function () {
                        UtilService.httpRequest('framework_common/account/' + aData.accountId, 'GET', {},
                            function (data) {
                                $scope.$apply(function () {
                                    var result  = data.data;
                                    $scope.detail = result;
                                    $scope.popShow = true;
                                    $scope.buildTree();
                                });
                            }
                        );
                    });
                    return nRow;
                }
            };

            //打开自定义页面
            $scope.openColumnDef = function(){
                UtilService.openColumnDef($scope.dtColumns);
            }

            // 关闭详情页
            $scope.closePop = function(){
                $scope.popShow = false;
            };

            //列定义
            $scope.dtColumns = [
                {
                    bSortable:false,sClass:'select-checkbox',mData:null,
                    sTitle:'<input type="checkbox" ng-click="toggleAll()" ng-model="allSelected"/>',
                    mRender:function(data, type, full, meta){
                        $scope.selectedRows[data.accountId] = false;
                        return '<input type="checkbox" ng-click="toggleOne()" ng-model="selectedRows['+data.accountId+']"/>';
                    }
                },
                {bVisible:false,mData:"accountId"},
                {sTitle:"用户代码",mData:"accountCode",bCanHidden:false},
                {sTitle:"用户姓名",mData:"accountName",bCanHidden:false},
                {sTitle:"管理员",mData:"isAdmin",mRender:function(data, type, full, meta){
                    return {"FALSE":"否","TRUE":"是"}[data];
                }},
                {sTitle:"管理部门",mData:"deptName"},
                {sTitle:"状态",mData:"enable",mRender:function(data, type, full, meta){
                    return {"FALSE":"禁用","TRUE":"启用"}[data];
                }},
                {sTitle:"操作",mData:null,bSortable:false,
                    mRender:function (data, type, full, meta) {
                        return "<a href='javascript:void(0);' ng-click='openEdit("+data.accountId+")' actionbtn action='manager.account.edit'>编辑</a>";
                    }
                },
            ];  

            // 多选删除
            $scope.selectedRows = [];
            $scope.allSelected = false;
            $scope.toggleAll = function () {
                for (var id in $scope.selectedRows) {
                    if ($scope.selectedRows.hasOwnProperty(id)) {
                        $scope.selectedRows[id] = $scope.allSelected;
                    }
                }
            };

            $scope.toggleOne = function () {
                for (var id in $scope.selectedRows) {
                    if ($scope.selectedRows.hasOwnProperty(id)) {
                        if(!$scope.selectedRows[id]) {
                            $scope.allSelected = false;
                            return;
                        }
                    }
                }
            };

            //选中个数
            $scope.selectedCount = function(){
                var result = 0;
                for (var id in $scope.selectedRows) {
                    if ($scope.selectedRows.hasOwnProperty(id) && $scope.selectedRows[id]) {
                        result++;
                    }
                }
                return result;
            }

            $scope.deleteRows = function(){
                var rows = [];
                for (var id in $scope.selectedRows) {
                    if ($scope.selectedRows.hasOwnProperty(id) && $scope.selectedRows[id]) {
                        rows.push(id);
                    }
                }

                var callback = function(res){
                    if(!res)return;

                    UtilService.httpRequest('framework_common/account/', 'DELETE',rows, function(){
                        $scope.dtInstance.reloadData(function () {}, false);
                    });
                };

                
                if(rows.length>0)UtilService.confirm("删除确认","确定要删除所选人员吗？",callback);
            }
        }];
});