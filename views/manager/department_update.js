/**
 * Created by lusm on 2016/11/14.
 */
define(['jquery', 'angular'], function () {
    // controller
    return ['$rootScope', '$scope', '$state', '$log', 'UtilService',
        function ($rootScope, $scope, $state, $log, UtilService) {
            $rootScope.$state = $state;//页面中的$state的隶属于$rootScope

            $scope.detail = {deptId:$state.params.id};

            $scope.person = {
                sex: 'MALE',
                deptId: 0
            };

            UtilService.httpRequest('framework_common/person_kind', 'GET', {
                "pageNumber": 1,
                "pageSize": 10
            }, function (result) {
                $scope.personKind = result.data.datas;
                $scope.$apply(function () {
                    $scope.person.personKindId = $scope.personKind[0].personKindId;
                });
            });

            //加载部门信息
            $scope.action = "新增";
            
            if($state.params.id != -1){
                UtilService.httpRequest('framework_common/dept/'+$scope.detail.deptId, 'GET', {}, 
                function (data) {
                    $scope.$apply(function () {
                        console.log(data);
                        $scope.detail = data.data;
                        $scope.parentDept = {value:$scope.detail.parentDeptId,text:$scope.detail.parentDeptName};
                        $scope.topDept = {value:$scope.detail.topDeptId,text:$scope.detail.topDeptName};
                    });
                });
                $scope.action = "编辑";
            }else{
                    $scope.account=JSON.parse(window.localStorage.getItem('account'));
                    $scope.parentDept = {value:$scope.account.deptId,text:$scope.account.deptName};
                    $scope.topDept = {value:$scope.account.deptId,text:$scope.account.deptName};

                    //上级部门默认为上一步选择的部门
                    //查询上级部门信息
                    console.log($state.params.superDept);
                    if($state.params.superDept != undefined){
                        UtilService.httpRequest(
                            'framework_common/dept/'+$state.params.superDept,
                            'GET',
                            {},
                            function (data) {
                                $scope.parentDept = {value:data.data.deptId,text:data.data.deptName};
                            }
                        );
                    }
            }

            $scope.doSave = function () {
                if ($scope.mainForm.$valid){
                    $scope.detail.parentDeptId = $scope.parentDept.value;
                    $scope.detail.parentDeptCode = null;
                    $scope.detail.parentDeptName = null;
                    $scope.detail.topDeptId = $scope.topDept.value;
                    $scope.detail.topDeptCode = null;
                    $scope.detail.topDeptName = null;

                    if($scope.detail.parentDeptId == $scope.detail.deptId){
                        UtilService.toastError('上级部门不能为当前部门！');
                        return;
                    }

                    UtilService.httpRequest(
                        'framework_common/dept',
                        $scope.detail.deptId== -1?'POST':'PUT',
                        $scope.detail,
                        function (result) {
                            UtilService.toastSuccess('部门保存成功！');
                            $state.go("main.department");
                        }
                    );
                }else{
                    $scope.mainForm.$dirty=true
                }
            };
            $scope.doCancel = function () {
                $state.go("framework.person");
            };
        }
    ];
});