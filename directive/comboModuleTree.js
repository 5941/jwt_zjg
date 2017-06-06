var isComboTreeOut = true;
define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("combomoduletree", function($rootScope, $timeout,UtilService) {
        return {
            restrict: 'AE',
            scope: {data:'=',type:'@'},
	        templateUrl: 'views/modal/comboTree.html',
            controller: function ($scope, $element) {
                if(!$scope.data)$scope.data = {text:"",value:-1};
                var id =parseInt(Math.random() * 100);

                $element.find('.comboTree').bind('click',function(event){
                    event.cancelBubble=true;
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
                    'version':1,
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
                    if(obj.node.parent == '#')return;
                    
                    $scope.$apply(function(){
                        $scope.showSelect = false;
                        $scope.data.value  = obj.node.id;
                        $scope.data.text  = obj.node.text;
                    });
                    
                };

                 // 成功返回
                var onSuccess1 = function (data) {
                    var datas = data.data.datas;
                    var treeData = [];
                    for (var i in datas) {
                        treeData.push({
                            "id": datas[i].subsystemId,
                            "parent": '#',
                            "text": datas[i].subsystemName,
                            "state": {
                                "opened": true
                            }
                        });
                    }
                    $scope.treeData = treeData;

                    UtilService.httpRequestSync('framework_common/module', 'GET', {pageNumber: 1, pageSize: 1000}, onSuccess2);    
                };

                var onSuccess2 = function (data) {
                    var datas = data.data.datas;
                    var treeData = $scope.treeData;
                    for (var i in datas) {
                        treeData.push({
                            "id": datas[i].moduleId,
                            "parent": datas[i].subsystemId,
                            "text": datas[i].moduleName,
                            "state": {
                                "opened": true
                            }
                        });
                    }
                    $scope.treeData = treeData;
                    $scope.treeConfig.version++;
                };

                UtilService.httpRequestSync('framework_common/subsystem', 'GET', {pageNumber: 1, pageSize: 1000}, onSuccess1);    
                
                $scope.showSelect = false;
            }
        };
    });
});