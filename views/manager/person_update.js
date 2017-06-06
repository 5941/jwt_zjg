define(['jquery', 'angular'], function () {
    // controller
    return ['$rootScope', '$scope', '$state','$stateParams','UtilService',
        function ($rootScope, $scope, $state, $stateParams, UtilService) {
             $rootScope.$state = $state;

            // 默认值
            $scope.person = {
                deptId : 0,
                sex: 'MALE',
                enable:true
            };
            console.log($state.params.superDept);

            // 加载人员类型可选项
            UtilService.httpRequest('framework_common/person_kind', 'GET', {
                "pageNumber": 1,
                "pageSize": 10
            }, function (result) {
                $scope.personKind = result.data.datas;
                $scope.$apply(function () {
                    $scope.person.personKindId = $scope.personKind[0].personKindId;
                });
            });

            // 加载数据
            $scope.action = "新增";
            if($state.params.id != -1){
                UtilService.httpRequest('framework_common/person/'+$state.params.id, 'GET', {}, 
                function (data) {
                    $scope.$apply(function () {
                        $scope.person = data.data;
                        $scope.dept = {value:$scope.person.deptId,text:$scope.person.deptName};
                    });
                });
                $scope.action = "编辑";
            }else{
                if($state.params.superDept != undefined){
                    UtilService.httpRequest(
                        'framework_common/dept/'+$state.params.superDept,
                        'GET',
                        {},
                        function (data) {
                            $scope.dept = {value:data.data.deptId,text:data.data.deptName};
                        }
                    );
                }
            }

            // 保存
            $scope.doSave = function () {

                if ($scope.mainForm.$valid){
                    $scope.person.deptId = $scope.dept.value;
                    UtilService.httpRequest(
                        'framework_common/person',
                        $state.params.id==-1?'POST':'PUT',
                        $scope.person,
                        function (result) {
                            UtilService.toastSuccess('人员保存成功！');
                            $state.go("main.person");
                        }
                    );
                }else{
                     $scope.mainForm.$dirty=true;
                }
            };
        }
    ];
});