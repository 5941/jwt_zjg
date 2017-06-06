define(['angularAMD','echarts'], 
    function (angularAMD,factory) {
    angularAMD.directive("comboPassArea", 
    function ($rootScope, $timeout, UtilService) {
        return {
            restrict: 'AE',
            scope: { ngShow:'=?',onSelect:'&?',ngModel:"=?"},
            templateUrl: 'views/forbid/directive/comboPassArea.html',
            controller: function ($scope, $element) {

                $(document).bind('click',function(){
                    safeApply($scope,function(){
                        $scope.showSuggest = false;
                    });
                });

                $element.bind('click',function(){
                    event.cancelBubble=true;
                });
                //查询常用通行范围
                $scope.loadPassAreas = function (keyword) {
                    var params = {pageNumber:1,pageSize:10,areaRange:keyword};

                    UtilService.httpRequest('jwt_forbid/forbid/configuration/pass_area', 'GET', params, function (data) {
                        safeApply($scope,function(){
                            $scope.commonPassAreas = data.data.datas;
                        });
                       
                    });
                };

                $scope.$watch('keyword',function(newValue,oldValue){
                    $scope.loadPassAreas(newValue)
                });

                $scope.type = 'recent';
                $scope.selectPassArea = function(passarea){
                    //$scope.ngModel = angular.copy(passarea);
                    for(var key in passarea){
                        $scope.ngModel[key] = passarea[key];
                    }
                    if($scope.onSelect)$scope.onSelect({data:passarea});
                    $scope.showSuggest = false;
                }
            }
        };
    });
});