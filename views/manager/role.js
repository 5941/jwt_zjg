define(['jquery', 'angular', 'jsTree', 'ngJsTree'], function () {
    // controller
    return ['$rootScope', '$scope', '$state', '$log', 'UtilService', '$timeout','$compile','notify',
        function ($rootScope, $scope, $state, $log, UtilService, $timeout,$compile,notify) {
            $scope.keyWord = '';


            //点击进入新增页面
            $scope.openNew = function () {
                $state.go('update.role',{'id':-1});
            };
            //点击进入编辑页面
            $scope.openEdit = function (id) {
                $state.go('update.role',{'id':id});
            };

            //刷新表格
            $scope.refreshTable = function () {
                    $scope.dtInstance.reloadData(function () {
                }, true);
            };

            //松开回车键时触发搜索事件
            document.getElementById('search').onkeypress = function(e){
                if(!e){
                    e = window.event;
                }
                if((e.keyCode || e.which) == 13){
                    $scope.refreshTable();
                }
            }

            //表格
            $scope.dtInstance = {};

            //表格选项定义
            $scope.dtOptions = {
                "processing": true,
                "serverSide": true,
                "order":[[1,"desc"]],
                "autoWidth":true,
                "createdRow":function(row, data, dataIndex) {
                    $('td', row).attr("ng-class","{table_select_bg:selectedRows["+data.roleId+"]}");
                    $compile(angular.element(row).contents())($scope);
                },
                "ajax": function (source, callback, settings) {
                    var onSuccess = function (data) {
                        var result = data.data.datas;

                        result.recordsTotal = data.data.totalRecords;
                        result.recordsFiltered = data.data.totalRecords;
                        $scope.allSelected = false;
                        $scope.selectedRows = [];
                        console.log(result);
                        callback(result);
                    };
                    UtilService.httpRequest('framework_common/role', 'GET',
                        {
                            pageNumber: source.start / source.length + 1,
                            pageSize: source.length,
                            roleName:$scope.keyWord,
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
                        // 角色基础信息
                        UtilService.httpRequest('framework_common/role/' + aData.roleId, 'GET', {},
                            function (data) {
                                $scope.$apply(function () {
                                    var result  = data.data;
                                    $scope.detail = result;
                                    $scope.detail.roleTypeName = {'PARENT_AUTHORIZED':'上级部门授予', 'DEPT_CREATED':'部门创建', 'CHILD_DEPT_CREATED':"子部门创建"}[$scope.detail.roleType];
                                    $scope.popShow = true;
                                    $scope.canEdit = true;
                                    if($scope.detail.roleId == 0 || $scope.detail.roleType!='DEPT_CREATED')$scope.canEdit = false;

                                    // 角色模块权限
                                    var treeData = [];
                                    for (var i in $scope.detail.roleModules) {
                                        if($scope.detail.roleModules[i].useRule == 'FALSE')continue;
                                        treeData.push({
                                            "id": $scope.detail.roleModules[i].moduleId,
                                            "parent": '#',
                                            "text": $scope.detail.roleModules[i].moduleName,
                                            "state": {
                                                "opened": true
                                            }
                                        });
                                    }
              
                                    $scope.moduleTreeData = treeData;
                                    $scope.moduleTreeConfig.version++;

                                    // 角色操作
                                    var treeData2 = [];
                                    // 模块
                                    angular.copy(treeData,treeData2);
                                    // 菜单
                                    for (var i in $scope.detail.roleMenus) {
                                        if($scope.detail.roleMenus[i].useRule == 'FALSE')continue;
                                        treeData2.push({
                                            "id": $scope.detail.roleMenus[i].menuId,
                                            "parent": $scope.detail.roleMenus[i].parentMenuId == undefined?$scope.detail.roleMenus[i].moduleId:$scope.detail.roleMenus[i].parentMenuId,
                                            "text": $scope.detail.roleMenus[i].menuName,
                                            "state": {
                                                "opened": true
                                            }
                                        });
                                    }
                                    // 操作
                                    for (var i in $scope.detail.roleActions) {
                                        if($scope.detail.roleActions[i].useRule == 'FALSE')continue;
                                        treeData2.push({
                                            "id": $scope.detail.roleActions[i].actionId,
                                            "parent": $scope.detail.roleActions[i].menuId,
                                            "text": $scope.detail.roleActions[i].actionName,
                                            "state": {
                                                "opened": true
                                            }
                                        });
                                    }
                                    $scope.actionTreeData = treeData2;
                                    $scope.actionTreeConfig.version++;
                                });
                            }
                        );

                        //刷新部门列表
                        $scope.refreshDeptTree();

                        // 角色成员信息
                        UtilService.httpRequest('framework_common/role/'+aData.roleId+'/account', 'GET', {},
                            function (data) {
                                $scope.$apply(function () {
                                    $scope.members = data.data;
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

            //关闭详情页
            $scope.closePop = function(){
                $scope.popShow = false;
            };

            //关闭用户详情页
            $scope.closePop2 = function(){
                $scope.popShow2 = false;
            };

            $scope.backPop2 = function(){
                $scope.popShow2 = false;
                $scope.popShow = true;
            };

            $scope.openAccountEdit = function (id) {
                $state.go('update.account',{'id':id});
            };

            //开启用户详情页
            $scope.openPop2 = function(account){
                var onSuccess = function(data){
                    if(data.data.length > 0){
                        $scope.account = account;
                        $scope.popShow = false;
                        $scope.popShow2 = true;
                        $scope.buildTree();
                    }
                }
                UtilService.httpRequest('framework_common/permission/menu', 'GET', {moduleCode: "manager", menuCode: "account"}, onSuccess);  
            };

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

            //列定义
            $scope.dtColumns = [
                {
                    bSortable:false,sClass:'select-checkbox',mData:null,
                    sTitle:'<input type="checkbox" ng-click="toggleAll()" ng-model="allSelected"/>',
                    mRender:function(data, type, full, meta){
                        $scope.selectedRows[data.roleId] = false;
                        return '<input type="checkbox" ng-click="toggleOne()" ng-model="selectedRows['+data.roleId+']"/>';
                    }
                },
                {sTitle:"角色名称",mData:"roleName",bCanHidden:false},
                {sTitle:"角色类型",mData:"roleType",mRender:function(data, type, full, meta){
                    
                    return {"PARENT_AUTHORIZED":"上级部门授予","DEPT_CREATED":"本部门创建","CHILD_DEPT_CREATED":"下级部门创建"}[data];
                }},
                {sTitle:"上级角色",mData:"parentRoleName",defaultContent:""},
                {sTitle:"创建部门",mData:"deptName"},
                {sTitle:"操作",mData:null,bSortable:false,
                    mRender:function (data, type, full, meta) {
                        if(data.roleId == 0 || data.roleType=='PARENT_AUTHORIZED' || data.roleType=='CHILD_DEPT_CREATED')return "";
                        return "<a href='javascript:void(0);' ng-click='openEdit("+data.roleId+")' actionbtn action='manager.role.edit'>编辑</a>";
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

                    UtilService.httpRequest('framework_common/role/', 'DELETE',rows, function(){
                        $scope.dtInstance.reloadData(function () {}, false);
                    });
                };

                
                if(rows.length>0)UtilService.confirm("删除确认","确定要删除所选人员吗？",callback);
            }

            //配置部门树
            $scope.deptTreeConfig = UtilService.getDefaultTreeConfig();

            $scope.moduleTreeConfig = UtilService.getDefaultTreeConfig();

            $scope.actionTreeConfig = UtilService.getDefaultTreeConfig();

            $scope.refreshDeptTree = function(){

                // 成功返回
                var onSuccess = function (data) {
                    var depts = data.data.datas;
                    var treeData = [];
                    for (var i in depts) {
                        treeData.push({
                            "id": depts[i].deptId,
                            "parent": i ==0 ? '#' : depts[i].parentDeptId,
                            "text": depts[i].deptName,
                            "state": {
                                "opened": true
                            }
                        });
                    }
                    $scope.deptTreeData = treeData;
                    $scope.deptTreeConfig.version++;
                };
                UtilService.httpRequest('framework_common/dept', 'GET', {pageNumber: 1, pageSize: 1000}, onSuccess);
            };
            
            $scope.canEdit = false;
            //监听选择树节点事件
            $scope.select_node = function (event, obj) {
                // 角色成员信息
                UtilService.httpRequest('framework_common/role/'+$scope.detail.roleId+'/account', 'GET', {deptId:obj.node.id},
                    function (data) {
                        $scope.$apply(function () {
                            var result  = data.data;
                            $scope.members = result;
                            $scope.detail.roleTypeName = {'PARENT_AUTHORIZED':'上级部门授予', 'DEPT_CREATED':'部门创建', 'CHILD_DEPT_CREATED':"子部门创建"}[$scope.detail.roleType];
                        });
                    }
                );
            };

            $scope.detail_show = 'info';
            $scope.tab_view = 'module';
        }];
});