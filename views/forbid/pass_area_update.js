define(['jquery', 'angular', 'jsTree', 'ngJsTree', "views/forbid/directive/mapThumbnail",
    "views/forbid/directive/forbidMap", "inspinia", 'lib/ol/html2canvas'], function () {
        // controller

        return ['$rootScope', '$scope', '$state', '$stateParams', 'UtilService', "$uibModal", '$log', '$timeout', '$compile', "$q",
            function ($rootScope, $scope, $state, $stateParams, UtilService, $uibModal, $log, $timeout, $compile, $q) {
                $scope.passArea = { pointList: '[]', facilityIdList: [], useType: 'TRUE', areaType: 'BROKEN_LINE' };
                var initMap = function () {
                    $timeout(function () {
                        if ($scope.forbidMap.init) {
                            $scope.forbidMap.init();
                            $scope.forbidMap.redraw($scope.passArea);
                        }
                        else {
                            initMap();
                        }
                    }, 1000);
                }

                if ($stateParams.id == -1) {
                    $scope.inTitle = "新增常用通行";
                    initMap();
                }
                else {
                    $scope.inTitle = "编辑常用通行";
                    var url = "jwt_forbid/forbid/configuration/pass_area";
                    var action = "GET";
                    var params = {
                        areaId: $stateParams.id,
                        pageNumber: 1,
                        pageSize: 1
                    }
                    var onSuccess = function (data) {
                        $scope.passArea = data.data.datas[0];
                        initMap();
                    }
                    UtilService.httpRequest(url, action, params, onSuccess);
                }

                $scope.createThumbImg = function (callback) {
                    if (!$scope.passArea) {
                        if (callback) callback();
                        return;
                    }
                    if ($scope.passArea.thumbUrl && $scope.passArea.thumbUrl != "") {
                        if (callback) callback();
                        return;
                    }
                    var width = $("forbid-map .map").width();
                    var height = $("forbid-map .map").height();
                    html2canvas($("forbid-map .map")[0], {
                        allowTaint: true,
                        taintTest: false,
                        width: width,
                        height: height,
                        onrendered: function (canvas) {
                            //生成base64图片数据  
                            var data = canvas.toDataURL("image/jpeg");
                            data = data.substr('data:image/jpeg;base64,'.length);
                            UtilService.uploadImgByBase64(data, function (data) {
                                $scope.passArea.thumbUrl = data.data[0];
                                if (callback) callback();
                            });
                        }
                    });
                }
                $scope.saveArea = function () {
                    console.log($scope.passArea)
                    $scope.createThumbImg(function () {
                        var url = "jwt_forbid/forbid/configuration/pass_area";
                        var action = $stateParams.id == -1 ? "POST" : "PUT";
                        var params = $scope.passArea;
                        var onSuccess = function () {
                            UtilService.toastSuccess("保存成功！");
                        }
                        UtilService.httpRequest(url, action, params, onSuccess);

                    })
                }

                //TODO:提交前检查是否有画线:points是否为空
            }
        ];
    });