define(['jquery', 'angular', 'jsTree', 'ngJsTree'], function () {
    // controller
    return ['$rootScope', '$scope', '$state', '$log', 'UtilService', '$timeout', '$compile', 'notify', '$uibModal',
        function ($rootScope, $scope, $state, $log, UtilService, $timeout, $compile, notify, $uibModal) {
            $rootScope.$state = $state;//页面中的$state的隶属于$rootScope
            $scope.moduleCode = $state.params.code;
            //配置菜单树
            $scope.menuTreeConfig = {
                core: {
                    multiple: false,
                    animation: true,
                    error: function (error) {
                        $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                    },
                    check_callback: true,
                    worker: true,
                    themes: {
                        dots: false,
                        icons: false
                    }
                },
                version: 1,
                'plugins': ['types'],
                'types': {
                    'default': {
                        'icon': 'fa fa-folder'
                    }
                }
            };
            //监听选择树节点事件
            $scope.select_node = function (event, obj) {
                // 加载数据
                UtilService.httpRequest('framework_common/menu/' + obj.node.id, 'GET', {},
                    function (data) {
                        $scope.$apply(function () {
                            var result = data.data;
                            $scope.detail = $.extend({}, result, {showAction: true});
                            $scope.module = {value: $scope.detail.moduleId, text: $scope.detail.moduleName};
                            $scope.parentMenu = {value: $scope.detail.parentMenuId, text: $scope.detail.parentMenuName};
                        });
                    }
                );
            };

            // 刷新树
            if (!$scope.instance) $scope.instance = {};
            $scope.instance.refresh = function () {
                // 成功返回
                var onSuccess = function (data) {
                    var menus = data.data.datas;
                    var treeData = [];
                    for (var i in menus) {
                        treeData.push({
                            "id": menus[i].menuId,
                            "parent": menus[i].parentMenuId == undefined ? '#' : menus[i].parentMenuId,
                            "text": menus[i].menuName,
                            "state": {
                                "opened": true
                            }
                        });
                    }
                    $scope.menuTreeData = treeData;

                    $timeout(function () {
                        for(var i in menus){
                            if(menus[i].parentMenuId == undefined){
                                $scope.treeInstance.jstree().select_node(menus[i].menuId);
                                break;
                            }
                            
                        }
                    }, 500)

                    $scope.menuTreeConfig.version++;
                };
                UtilService.httpRequest('framework_common/menu',
                    'GET',
                    {pageNumber: 1, pageSize: 1000, moduleCode: $state.params.code},
                    onSuccess);
            };

            $scope.instance.refresh();
            // 新增
            $scope.openNew = function () {
                $scope.detail = {
                    showAction: false
                };
            }

            // 删除
            $scope.doDelete = function () {
                var callback = function (res) {
                    if (!res)return;

                    UtilService.httpRequest('framework_common/menu/' + $scope.detail.menuId, 'DELETE', {}, function () {
                        $scope.instance.refresh();

                        $scope.menuTree.reload();
                    });
                };

                UtilService.confirm("删除确认", "确定要删除所选菜单吗？", callback);
            }

            // 保存
            $scope.doSave = function () {
                $scope.detail.moduleId = $state.params.id;
                $scope.detail.parentMenuId = $scope.parentMenu.value == -1 ? null : $scope.parentMenu.value;
                $scope.module = {value: -1, text: ''};
                $scope.parentMenu = {value: -1, text: ''};

                UtilService.httpRequest(
                    'framework_common/menu',
                    $scope.detail.menuId == null ? 'POST' : 'PUT',
                    $scope.detail,
                    function (result) {
                        UtilService.toastSuccess('菜单保存成功！');
                        $scope.instance.refresh();

                        $scope.menuTree.reload();
                    }
                );
            };
            //点击配置操作
            $scope.doAction = function () {
                var menuId = $scope.detail.menuId;
                var menuCode = $scope.detail.menuCode;
                var moduleCode = $scope.detail.moduleCode;
                $uibModal.open({
                    templateUrl: 'views/framework/menu-action.html',
                    size: 'lg',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.refresh = function () {
                            UtilService.httpRequest('framework_common/action',
                                'GET',
                                {pageNumber: 1, pageSize: 100, menuCode: menuCode, moduleCode: moduleCode},
                                function (data) {
                                    $scope.$apply(function () {
                                        $scope.actions = data.data.datas;
                                    });
                                });
                        };
                        $scope.refresh();
                        $scope.nAction = {};
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        //删除操作
                        $scope.doRemoveAction = function (id) {
                            UtilService.httpRequest('framework_common/action/' + id,
                                'DELETE',
                                {},
                                function (data) {
                                    $scope.refresh();
                                });
                        };
                        //新增
                        $scope.doAddAction = function () {
                            UtilService.httpRequest('framework_common/action',
                                'POST',
                                $.extend({}, $scope.nAction, {'menuId': menuId}),
                                function (data) {
                                    $scope.refresh();
                                    $scope.nAction = {};
                                });
                        }
                    }
                });
            }
        }];
});