define(['angularAMD','echarts','ol','om',
'views/forbid/directive/forbidMap',
'views/forbid/directive/viewForbidRange',
'lib/ol/html2canvas'], 
    function (angularAMD, echarts ,ol,om,factory) {
    angularAMD.directive("editForbidRange", 
    function ($rootScope, $timeout, UtilService) {
        return {
            restrict: 'AE',
            scope: { onClose:'&?',passAreas:'=',ngShow:"=?",om:'=?',onSubmit:"&?"},
            templateUrl: 'views/forbid/directive/editForbidRange.html',
            controller: function ($scope, $element) {
                var isMapInited = false;
                $scope.common_list = [{thumb:'',name:''},{thumb:'',name:''},{thumb:'',name:''},{thumb:'',name:''}];
                $scope.onwayPoints = [{address:'xxxxxx',lat:0,lon:0}];
                $scope.showCommonRange = true;

                $scope.close = function(){
                    for(var i in $scope.passAreas){
                        if(!$scope.passAreas[i].areaRange || $scope.passAreas[i].areaRange == ""){
                            UtilService.toastError('请输入通行范围'+(parseInt(i)+1)+"的描述");
                            return;
                        }
                    }
                    $scope.createThumbImg(function(){
                        if($scope.onClose)$scope.onClose({data:{}});
                    });
                }

                $scope.clearDraw = function(){
                    $scope.curPassArea.pointList = "[]";
                    $scope.curPassArea.thumbUrl = '';//需要重现创建截图
                    $scope.forbidMap.clearDraw();
                };

                $scope.selectPassArea = function(passArea){
                    $scope.createThumbImg(function(){
                        $scope.curPassArea = passArea;
                        $scope.forbidMap.redraw($scope.curPassArea);
                    });
                };

                $scope.$watch('ngShow', function (newValue, oldValue) {
                    if(newValue){
                        // 默认选中第一笔信息
                        if(!isMapInited){
                            $timeout(function(){
                                $scope.forbidMap.init();
                                isMapInited= true;
                                $scope.selectPassArea($scope.passAreas[0]);
                            });
                        }
                    }
                }, true);
                
                $scope.addDefPassArea = function(){
                    $scope.passAreas.push({pointList:'[]',facilityIdList:[],useType:'TEMP',areaType:'BROKEN_LINE'});
                };

                $scope.deletePassArea = function(index){
                    UtilService.confirm("删除确认", "确定要删除所选通行范围吗？", function(){
                        safeApply($scope,function(){
                            $scope.passAreas.splice(index,1);
                            if($scope.passAreas.length == 0)$scope.addDefPassArea();
                            console.log($scope.curPassArea);
                            if(!$scope.curPassArea)$scope.curPassArea = $scope.passAreas[0];
                        });
                    });
                };

                $scope.selectCommonPassArea = function(passArea){
                    //检查是否已经画线
                    if($scope.curPassArea.pointList != '[]'){
                        UtilService.toastError("请先清除原通行路线");
                        return;
                    }
                    
                    $scope.curPassArea.pointList = passArea.pointList;
                    $scope.curPassArea.areaType = passArea.areaType;
                    $scope.curPassArea.thumbUrl = '';//需要重现创建截图

                    $scope.forbidMap.redraw($scope.curPassArea);
                }

                $scope.loadPassAreas = function (keyword) {
                    var params = {pageNumber:1,pageSize:10,areaRange:keyword};

                    UtilService.httpRequest('jwt_forbid/forbid/configuration/pass_area', 'GET', params, function (data) {
                        safeApply($scope,function(){
                            $scope.commonPassAreas = data.data.datas;
                        });
                       
                    });
                };
                $scope.loadPassAreas();

                $scope.createThumbImg = function(callback){
                    if(!$scope.curPassArea){
                        if(callback)callback();
                        return;
                    }
                    if($scope.curPassArea.thumbUrl && $scope.curPassArea.thumbUrl != ""){
                        if(callback)callback();
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
                                $scope.curPassArea.thumbUrl = data.data[0];
                                if(callback)callback();
                            });
                        }
                    });
                }

                $scope.preview = function(){
                    $('.preview').modal();
                    $timeout(function(){
                        $scope.previewMap.init();
                        $scope.previewMap.redraw($scope.passAreas);
                    },1000);
                };

                $scope.closePreview = function(){
                    $('.preview').modal('hide');
                    if($scope.onSubmit)$scope.onSubmit();
                };

                $scope.submit = function(){
                    $scope.createThumbImg(function(){
                        if($scope.onSubmit)$scope.onSubmit();
                    });
                }

                $timeout(function(){
                    //$scope.forbidMap.loadFacilitys();
                    //$scope.forbidMap.drawStartPoint(119.46965364013671,31.442276830749517);
                    //$scope.forbidMap.drawEndPoint(119.49548867736816,31.428157682495122);
                },2000);
            }
        };
    });
});