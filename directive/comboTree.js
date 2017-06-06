var isComboTreeOut = true;
define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("combotree", function($rootScope, $timeout,UtilService) {
        return {
            restrict: 'AE',
            scope: {data:'=',type:'@',onSelect:'&',onLoaded:'&?',module:'@?',instance:'=?'},
	        templateUrl: 'views/modal/comboTree.html',
            controller: function ($scope, $element) {
                if(!$scope.data)$scope.data = {text:"",value:-1};
                var id =parseInt(Math.random() * 100);

                $element.find('.comboTree').bind('click',function(event){
                    event.cancelBubble=true;
                    event.stopPropagation();
                });

                $element.find('.comboTreeInput').bind('click',function(){
                    $(".comboTree").hide();
                    event.cancelBubble=true;
                    $element.find('.comboTree').show();
                });

                $(document).bind('click',function(){
                    $(".comboTree").hide();
                });

                $scope.treeConfig = {
                    core: {
                        multiple: false,
                        animation: true,
                        error: function (error) {
                            $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                        },
                        check_callback: true,
                        worker: true,
                        themes:{
                            dots:false
                        }
                    },
                    version:1,
                    'plugins': ['types', 'search'],
                    'search': {
                        show_only_matches: true,
                        show_only_matches_children: true
                    },
                    'types': {
                        'default': {
                            'icon': 'fa fa-folder'
                        }
                    }
                };
                $scope.treeData = [];
                //监听选择树节点事件
                 $scope.cancelSelect = function(){
                        $scope.showSelect = false;
                }

                $scope.select_node = function (event, obj) {
                    $scope.$apply(function(){
                        $scope.showSelect = false;
                        $scope.data.value  = obj.node.id;
                        $scope.data.text  = obj.node.text;
                        $scope.data.data  = obj.node.data;
                        $(".comboTree").hide();
                        $scope.onSelect({data:$scope.data});
                    });
                };

                $scope.loaded = function (event, obj) {
                    console.log('loaded');
                    if($scope.onLoaded)$scope.onLoaded({data:$scope.treeData});
                };

                 // 成功返回
                var onSuccess = function (data) {
                    var datas = data.data.datas;
                    var treeData = [];
                    if($scope.type == "menu"){
                        treeData.push({
                            "id": -1,
                            "parent": '#',
                            "text": '请选择',
                            "state": {
                                "opened": true
                            }
                        });
                    }

                    for (var i in datas) {
                        if($scope.type == "dept"){
                            treeData.push({
                                "id": datas[i].deptId,
                                "parent": i==0 ? '#' : datas[i].parentDeptId,
                                "text": datas[i].deptName,
                                "data": datas[i],
                                "state": {
                                    "opened": true
                                }
                            });
                        }else if($scope.type == "menu"){
                            treeData.push({
                                "id": datas[i].menuId,
                                "parent": (i==0 || datas[i].parentMenuId == undefined) ? '#' : datas[i].parentMenuId,
                                "text": datas[i].menuName,
                                "state": {
                                    "opened": true
                                }
                            });
                        }else if($scope.type == "role"){
                            treeData.push({
                                "id": datas[i].roleId,
                                "parent":'#' ,//(i==0  || datas[i].parentRoleId == undefined) ? '#' : datas[i].parentRoleId,
                                "text": datas[i].roleName,
                                "state": {
                                    "opened": true
                                }
                            });
                        }
                    }
                    $scope.treeData = treeData;
                    $scope.treeConfig.version++;
                };

                if(!$scope.instance)$scope.instance = {};
                $scope.instance.reload = function(){
                    if($scope.type == "dept")
                        UtilService.httpRequest('framework_common/dept', 'GET', {pageNumber: 1, pageSize: 1000}, onSuccess);
                    else if($scope.type == "menu")
                        UtilService.httpRequest('framework_common/menu', 'GET', {pageNumber: 1, pageSize: 1000,moduleCode:$scope.module}, onSuccess); 
                    else if($scope.type == "role")
                        UtilService.httpRequest('framework_common/role', 'GET', {pageNumber: 1, pageSize: 1000}, onSuccess);       
                    $scope.showSelect = false;
                }
            }
        };
    });
});