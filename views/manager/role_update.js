define(['jquery', 'angular', 'jsTree', 'ngJsTree'], function () {
    // controller
    return ['$rootScope', '$scope', '$state', '$log', 'UtilService', '$timeout','$compile','notify',
        function ($rootScope, $scope, $state, $log, UtilService, $timeout,$compile,notify) {
            $scope.data = {};
            $scope.detail = {};
            $scope.oldRole = -1;
            $scope.modules_selected = [];//已选中模块
            $scope.menus_selected = [];//已选中菜单
            $scope.actions_selected = [];//已选中操作
            $scope.menus_for_select = [];//可选菜单
            $scope.actions_for_select = [];//可选操作
            $scope.parentRoles = {};
            if($state.params.id==-1){
                $scope.showEdit = false;
            }else{
                $scope.showEdit = true;
            }
            $scope.tab_view = "info";
            $scope.next_step = "下一步";

            $scope.role = {};
            $scope.warning_show = false;
            UtilService.httpRequest('framework_common/role', 'GET', {pageNumber:1,pageSize:100,roleTypes:'PARENT_AUTHORIZED'},function(data){
                $scope.parentRoles = data.data.datas;
            });

            $scope.selectParentsRole = function(item){
                $scope.detail.parentRoleName=item.roleName;
                $scope.detail.parentRoleId=item.roleId

            }
            $scope.next = function(){
                $scope.next_step = "下一步";
                if($scope.tab_view == "info"){
                    if ($scope.mainForm.$valid && $scope.detail.parentRoleId!= null){
                        $scope.tab_view = "module";
                        if($scope.oldRole != $scope.detail.parentRoleId){
                            $scope.oldRole = $scope.detail.parentRoleId;
                            // 重新加载模块列表、菜单列表、操作列表
                            UtilService.httpRequest('framework_common/role/'+$scope.detail.parentRoleId, 'GET', {},function(data){
                                $scope.$apply(function(){
                                    $scope.actions = data.data.roleActions;
                                    $scope.menus = data.data.roleMenus;
                                    $scope.modules = data.data.roleModules;

                                    $scope.buildModuleTree();
                                });
                            });
                        }
                    }else{
                        $scope.warning_show = true;
                    }
                }else if($scope.tab_view == "module"){
                    

                    var nodes = $scope.moduleTreeInstance.jstree().get_checked();
                    
                    // 构建选中模块、菜单列表
                    var oldModules = $scope.modules_selected;
                    $scope.modules_selected = [];
                    $scope.menus_for_select = [];
                    for(var j in nodes){
                        for(var i in $scope.modules){
                            if($scope.modules[i].moduleId == nodes[j]){
                                if(oldModules != null){
                                    // 恢复之前的模块数据权限值
                                    for(var k in oldModules){
                                        if(oldModules[k].moduleId == $scope.modules[i].moduleId){
                                            $scope.modules[i].dataRule = oldModules[k].dataRule;
                                            if($state.params.id > 0)$scope.modules[i].roleId = $state.params.id;
                                            break;
                                        }
                                    }
                                }
                                
                                $scope.modules_selected.push($scope.modules[i]);
                                break;
                            }
                        }

                        for(var i in $scope.menus){
                            if($scope.menus[i].moduleId == nodes[j]){
                                $scope.menus_for_select.push($scope.menus[i]);
                            }
                        }
                    }

                    if($scope.modules_selected.length == 0){
                        UtilService.toastError('请至少选择一个模块！');
                        return;
                    }
                    
                    $scope.buildActionTree();
                    
                    $scope.tab_view = "data";
                }else if($scope.tab_view == "data"){
                    console.log($scope.modules_selected);
                    
                    $scope.tab_view = "action";
                    $scope.next_step = "完成";
                }else if($scope.tab_view == "action"){
                    $scope.save();
                }
            }

            $scope.prior = function(){
                
                if($scope.tab_view == "info"){
                    
                }else if($scope.tab_view == "module"){
                    $scope.tab_view = "info";
                }else if($scope.tab_view == "data"){
                    $scope.tab_view = "module";
                }else if($scope.tab_view == "action"){
                    $scope.tab_view = "data";
                    $scope.next_step = "下一步";
                }
            }

            $scope.save = function(){
                // 构建已选中操作
                $scope.actions_selected = [];
                var nodes = $scope.actionTreeInstance.jstree().get_checked();
                
                for(var i in $scope.actions_for_select){
                    for(var j in nodes){
                        if($scope.actions_for_select[i].actionId == nodes[j]){
                            $scope.actions_selected.push($scope.actions_for_select[i]);
                            break;
                        }
                    }
                }

                // 构建已选中菜单
                $scope.menus_selected = [];
                nodes = $scope.actionTreeInstance.jstree().get_checked();
                for(var i in $scope.menus_for_select){
                    for(var j in nodes){
                        if($scope.menus_for_select[i].menuId == nodes[j]){
                            $scope.menus_selected.push($scope.menus_for_select[i]);
                            break;
                        }
                    }
                }

                $scope.detail.roleModules = JSON.parse(angular.toJson($scope.modules_selected));
                $scope.detail.roleActions = $scope.actions_selected;
                $scope.detail.roleMenus = $scope.menus_selected;

                console.log($scope.detail.roleModules);
                UtilService.httpRequest(
                    'framework_common/role',
                    $state.params.id==-1?'POST':'PUT',
                    $scope.detail,
                    function (result) {
                        UtilService.toastSuccess('角色保存成功！');
                        $state.go("main.role");
                    }
                );
            }

            //加载模块列表
            UtilService.httpRequest('framework_common/module', 'GET', {pageNumber:1,pageSize:100},function(data){
                $scope.modules = data.data.datas;
            });

            // 加载子系统列表
            UtilService.httpRequest('framework_common/subsystem', 'GET', {pageNumber:1,pageSize:100},function(data){
                $scope.subsystems = data.data.datas;
            });

            // 角色操作权限
            $scope.actionTreeConfig = UtilService.getEditableTreeConfig();
            $scope.buildActionTree = function(){
                var treeData = [];
                //加入模块信息
                for (var i in $scope.modules_selected) {
                    if($scope.modules_selected[i].useRule == "FALSE")continue;
                    treeData.push({
                        "id": $scope.modules_selected[i].moduleId,
                        "parent": '#',
                        "text": $scope.modules_selected[i].moduleName,
                        "data":"module",
                        "state": {
                            "opened": true
                        }
                    });
                }
                //加入菜单信息
                 for (var i in $scope.menus_for_select) {
                    if($scope.menus_for_select[i].useRule == "FALSE")continue;
                    treeData.push({
                        "id": $scope.menus_for_select[i].menuId,
                        "parent": $scope.menus_for_select[i].parentMenuId == undefined?$scope.menus_for_select[i].moduleId:$scope.menus_for_select[i].parentMenuId,
                        "text": $scope.menus_for_select[i].menuName,
                        "data":"menu",
                        "state": {
                            "opened": true
                        }
                    });
                }

                //加入菜单操作
                $scope.actions_for_select = [];
                for (var i in $scope.actions) {
                    if($scope.actions[i].useRule == "FALSE")continue;
                    // 判断操作对应的菜单是否存在
                    for(var j in $scope.menus_for_select){
                        if($scope.actions[i].menuId == $scope.menus_for_select[j].menuId){
                            treeData.push({
                                "id": $scope.actions[i].actionId,
                                "parent": $scope.actions[i].menuId == undefined?'#':$scope.actions[i].menuId,
                                "text": $scope.actions[i].actionName,
                                "data":"action",
                                "state": {
                                    "opened": true
                                }
                            });
                            $scope.actions_for_select.push($scope.actions[i]);
                            break;
                        }
                    } 
                }

                $scope.actionTreeData = treeData;
                $scope.actionTreeConfig.version++;

                // 勾选已选中菜单
                $timeout(function(){
                    for(var i in $scope.menus_selected){
                        if($scope.menus_selected[i].useRule == "FALSE")continue;
                        for(var j in treeData){
                            if(treeData[j].id == $scope.menus_selected[i].menuId){
                                $scope.cascade_check_children = false;
                                $scope.actionTreeInstance.jstree().check_node(treeData[j].id);
                                $scope.cascade_check_children = true;
                                break;
                            }
                        }
                    }
                    
                    
                    // 勾选已选中操作
                    for(var i in $scope.actions_selected){
                        if($scope.actions_selected[i].useRule == "FALSE")continue;
                        for(var j in treeData){
                            if(treeData[j].id == $scope.actions_for_select[i].actionId){
                                $scope.actionTreeInstance.jstree().check_node(treeData[j].id);
                                break;
                            }
                        }
                    }
                },200);
            }

            // 角色模块树
            $scope.moduleTreeConfig = UtilService.getEditableTreeConfig();
            $scope.buildModuleTree = function(){
                var treeData = [];

                // 加入子系统信息
                for (var i in $scope.subsystems) {
                    treeData.push({
                        "id": $scope.subsystems[i].subsystemId,
                        "parent": '#',
                        "text": $scope.subsystems[i].subsystemName,
                        "state": {
                            "opened": true
                        }
                    });
                }

                //加入模块信息
                for (var i in $scope.modules) {
                    if($scope.modules[i].useRule == "FALSE")continue;
                    treeData.push({
                        "id": $scope.modules[i].moduleId,
                        "parent": $scope.modules[i].subsystemId,
                        "text": $scope.modules[i].moduleName,
                        "state": {
                            "opened": true
                        }
                    });
                }

                $scope.moduleTreeData = treeData;
                $scope.moduleTreeConfig.version++;

                // 勾选已选中模块
                $timeout(function(){
                    for(var i in $scope.modules_selected){
                    if($scope.modules_selected[i].useRule == "FALSE")continue;
                        for(var j in treeData){
                            if(treeData[j].id == $scope.modules_selected[i].moduleId){
                                // 勾选模块
                                $scope.moduleTreeInstance.jstree().check_node($scope.modules_selected[i].moduleId);
                                break;
                            }
                        }
                    }
                },200);
            }

            $scope.cascade_check_children = true;
            $scope.check_node = function(event, obj){
                //选中所有子节点
                if($scope.cascade_check_children){
                    
                    for(var i in obj.node.children){
                        obj.instance.check_node(obj.node.children[i]);
                    }
                }

                //选中父节点
                if(!obj.instance.is_checked(obj.node.parent)){
                    $scope.cascade_check_children = false;
                    obj.instance.check_node(obj.node.parent);
                    $scope.cascade_check_children = true;
                }
            }

            $scope.uncheck_node = function(event, obj){
                //取消选中子节点
                for(var i in obj.node.children){
                    obj.instance.uncheck_node(obj.node.children[i]);
                }
            }

            // 获取角色信息
            $scope.action = "新增"
            if($state.params.id != -1){
                UtilService.httpRequest('framework_common/role/'+$state.params.id, 'GET', {},function(data){
                    $scope.$apply(function(){
                        $scope.detail = data.data;

                        $scope.actions_selected = $scope.detail.roleActions;
                        $scope.menus_selected = $scope.detail.roleMenus;
                        $scope.modules_selected = $scope.detail.roleModules;
                    });
                });
                $scope.action = "编辑"
            }else{
                $scope.detail = JSON.parse(window.localStorage.getItem('account'));
                $scope.dept = {value:$scope.detail.deptId,text:$scope.detail.deptName};
                $scope.role = {value:$scope.detail.roleId,text:$scope.detail.roleName};
            }
        }];
});