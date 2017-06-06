define(['angularAMD','echarts'], 
    function (angularAMD,factory) {
    angularAMD.directive("carDetail", 
    function ($rootScope, $timeout, UtilService) {
        return {
            restrict: 'AE',
            scope: { onClose:'&?',ngShow:'=?',ngModel:'=?'},
            templateUrl: 'views/forbid/directive/carDetail.html',
            controller: function ($scope, $element) {

                $(document).bind('click',function(){
                    safeApply($scope,function(){
                        if($scope.onClose)$scope.onClose({car:$scope.ngModel});
                    });
                });

                $element.bind('click',function(){
                    event.cancelBubble=true;
                });
            }
        };
    });
});