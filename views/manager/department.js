define(['jquery', 'angular', 'jsTree', 'ngJsTree'], function () {
    // controller
    return ['$rootScope', '$scope', '$state', '$log', 'UtilService', '$timeout',
        function ($rootScope, $scope, $state, $log, UtilService,  $timeout) {
            $rootScope.$state = $state;//页面中的$state的隶属于$rootScope

            $scope.onTreeSelect = function(){
                
                 var onSuccess = function (data) {
                    $scope.$apply(function(){
                        $scope.detail = data.data;
                    });
                };

                UtilService.httpRequest('framework_common/dept/'+$scope.deptnode.deptId, 'GET', {}, onSuccess);
            }

            //点击进入新增页面
            $scope.openNew = function () {
                $state.go('update.department',{'id':-1,superDept:$scope.detail.deptId});
            };
            //点击进入编辑页面
            $scope.openEdit = function (id) {
                $state.go('update.department',{'id':id});
            };

            $scope.delete = function (id) {
                var callback = function(res){
                    if(!res)return;

                    UtilService.httpRequest('framework_common/dept/'+$scope.detail.deptId, 'DELETE', {}, 
                    function (data) {
                        $scope.$apply(function () {
                            UtilService.toastSuccess("部门删除成功");
                            $scope.treeInstance.refresh();
                        });
                    });
                };
                UtilService.confirm("删除确认","确定要删除此部门吗？",callback);
            };
        }];
});