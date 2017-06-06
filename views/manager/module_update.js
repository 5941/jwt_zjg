define(['jquery', 'angular', 'jsTree', 'ngJsTree'], function () {
    // controller
    return ['$rootScope', '$scope', '$state', '$log', 'UtilService', '$timeout','$compile','notify',
        function ($rootScope, $scope, $state, $log, UtilService, $timeout,$compile,notify) {
            $scope.data = {};
            // 加载子系统选项
            UtilService.httpRequest('framework_common/subsystem', 'GET', {pageNumber: 1,pageSize: 100,},
                function (data) {
                    $scope.$apply(function () {
                        var result  = data.data.datas;
                        $scope.subsystems = result;
                    });
                }
            );

            // 加载数据
            $scope.action= "新增"
            if($state.params.id != -1) $scope.action= "编辑";
            UtilService.httpRequest('framework_common/module/' + $state.params.id, 'GET', {},
                function (data) {
                    $scope.$apply(function () {
                        var result  = data.data;
                        $scope.detail = result;
                    });
                }
            );

             // 保存
            $scope.doSave = function () {
                if ($scope.mainForm.$valid) {
                    UtilService.httpRequest(
                        'framework_common/module',
                        $state.params.id== -1?'POST':'PUT',
                        $scope.detail,
                        function (result) {
                            UtilService.toastSuccess('保存模块成功！');
                            $state.go("main.module");
                        }
                    );
                }
            };
        }];
});