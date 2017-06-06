define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("depttree", function($rootScope, $timeout,UtilService) {
        return {
            restrict: 'AE',
            scope: {onSelect:'&',data:'=',instance:"=",onLoaded:'&?'},
	        templateUrl: 'views/modal/deptTree.html',
            controller: function ($scope, $element) {
                $scope.depts = [];

                 //配置树
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
                    version : 1,
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
                $scope.select_node = function (event, obj) {
                    var onSuccess = function (data) {
                        $scope.$apply(function(){
                            $scope.data = {deptId:obj.node.id,deptName:obj.node.text};
                        });
                        $scope.onSelect();
                    };
                    
                    UtilService.httpRequest('framework_common/dept/'+obj.node.id, 'GET', {}, onSuccess);
                };
                if(!$scope.instance)$scope.instance = {};
                $scope.instance.refresh = function(){

                    // 成功返回
                    var onSuccess = function (data) {
                        var depts = data.data.datas;
                        
                        var treeData = [];
                        
                        for (var i in depts) {
                            treeData.push({
                                "id": depts[i].deptId,
                                "parent": i==0 ? '#' : depts[i].parentDeptId,
                                "text": depts[i].deptName,
                                "state": {
                                    "opened": true
                                }
                            });
                        }

                        $scope.treeData = treeData;
                        $scope.treeConfig.version++;

                        $scope.data = {deptId:depts[0].deptId,deptName:depts[0].deptName};
                        $scope.depts = depts; 
                    };
                    
                    UtilService.httpRequest('framework_common/dept', 'GET', {pageNumber: 1, pageSize: 1000}, onSuccess);
                };
                
                $scope.instance.refresh();
                
                $scope.loaded = function (event, obj) {
       
                    if($scope.depts.length > 0){
                        $scope.treeInstance.jstree().select_node($scope.depts[0].deptId);
                    }
                };

                //树的查询
                var to = false;
                $scope.searchTree = function () {
                    if (to) {
                        clearTimeout(to);
                    }
                    to = setTimeout(function () {
                        if($scope.keyword == undefined)return;
                        console.log($scope.keyword);
                        $scope.treeInstance.jstree().search($scope.keyword);
                    }, 300);
                };
            }
        };
    });
});