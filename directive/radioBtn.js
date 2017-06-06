define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("radioBtn", function($rootScope, $timeout,UtilService) {
        return {
            restrict: 'AE',
            scope: {ngModel:'=?',text:"@?",value:"@"},
	        templateUrl: 'directive/templete/radioBtn.html',
            controller: function ($scope, $element) {
                $scope.select = function(){
                    $scope.ngModel = $scope.value;
                }
            }
        };
    });
});