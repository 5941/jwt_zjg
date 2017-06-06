define(['angularAMD','echarts'], 
    function (angularAMD,factory) {
    angularAMD.directive("comboPoiSearch", 
    function ($rootScope, $timeout, UtilService,MapService) {
        return {
            restrict: 'AE',
            scope: { onClose:'&?',onSelect:'&?',ngShow:'=?',ngModel:'=?'},
            templateUrl: 'views/forbid/directive/comboPoiSearch.html',
            controller: function ($scope, $element) {
                $scope.showSuggest=false;
                $scope.oldKeyword = 'xxxx';
                $scope.keyword = '';

                $(document).bind('click',function(){
                    safeApply($scope,function(){
                        $scope.ngShow = false;
                    });
                });

                $element.bind('click',function(){
                    event.cancelBubble=true;
                });

                 $scope.$watch('keyword', function (newValue,oldValue) {
                    if(!newValue || newValue == '' || newValue == undefined){
                        $scope.showSuggest=false;
                        return;
                    }

                    if($scope.oldKeyword == $scope.keyword)return;

                    $scope.ngModel = null;
                    $scope.loadData($scope.keyword);
	            },true);

                $scope.loadData = function(keywords){
                    var onSuccess =function(data){
                        $scope.showSuggest=data.data.datas.length>0;
                        $scope.datas=data.data.datas;
                        console.log(data);
                    }
                    MapService.searchPois(keywords,onSuccess);
                }

                $scope.select = function(data){
                    $scope.ngModel = data;
                    $scope.oldKeyword = data.name;
                    $scope.keyword = data.name;
                    $scope.showSuggest=false;
                    if($scope.onSelect)$scope.onSelect({data:data});
                }
            }
        };
    });
});