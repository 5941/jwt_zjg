define(['jquery', 'angular', 'jsTree', 'ngJsTree', "views/forbid/directive/mapThumbnail", "inspinia"], function () {
    // controller

    return ['$rootScope', '$scope', '$state', '$stateParams', 'UtilService', "$uibModal", '$log', '$timeout', '$compile', "$q",
        function ($rootScope, $scope, $state, $stateParams, UtilService, $uibModal, $log, $timeout, $compile, $q) {
            $rootScope.$state = $state;
            $scope.locale = UtilService.rangedate_locale;

            $scope.params = {
                areaRange: ""
            }

            $scope.editArea = function (item) {
                $state.go("update.forbid_forbid_area", {
                    id: item.forbidAreaId
                })
            }
            $scope.addArea = function () {
                $state.go("update.forbid_forbid_area", {
                    id: -1
                });
            }
            $scope.deleteArea = function (item) {
                var url = "jwt_forbid/forbid/configuration/forbid_area";
                var action = "DELETE";
                var params = {
                    forbidAreaId: item.forbidAreaId
                }
                var onSuccess = function () {
                    UtilService.toastSuccess("删除成功！");
                    $scope.dtInstance1.reloadData(function () { }, true);
                }
                UtilService.httpRequest(url, action, params, onSuccess);
            }

            $scope.search = function () {
                $scope.dtInstance1.reloadData(function () { }, true);
            }

            $scope.dtInstance1 = {};
            $scope.dtOptions1 = {
                "processing": true,
                "serverSide": true,
                "order": [],
                "autoWidth": true,
                "createdRow": function (row, data, dataIndex) {
                    $('td', row).attr("ng-class", "{table_select_bg:selectedRows1===" + dataIndex + "}");
                    $compile(angular.element(row).contents())($scope);
                },
                "ajax": function (source, callback, settings) {
                    var onSuccess = function (data) {
                        var result = data.data.datas;
                        result.recordsTotal = data.data.totalRecords;
                        result.recordsFiltered = data.data.totalRecords;

                        $scope.areaList = data.data.datas;
                        callback(result);
                    };

                    var params = {
                        pageNumber: source.start / source.length + 1,
                        pageSize: source.length
                    }
                    $.extend(params, $scope.params);

                    UtilService.httpRequest('jwt_forbid/forbid/configuration/forbid_area', 'GET', params, onSuccess);
                    // UtilService.httpRequest('jwt_vehicle/key_vehicle/car_illegal/page', 'POST', params, onSuccess);
                },
                "headerCallback": function (header) {
                    $compile(angular.element(header).contents())($scope);
                },
                // "rowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                // 	$(nRow).unbind('click');
                // 	$(nRow).bind('click', function () {

                // 		$scope.$apply(function () {
                // 			// $scope.selectedRows1=iDisplayIndex;
                // 			$scope.popShow = true;
                // 		});

                // 	});
                // 	return nRow;
                // }

            };

            $scope.dtColumns1 = [

            ];
        }
    ];
});