define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("toggleBtn", function($rootScope, $timeout,UtilService) {
        return {
            restrict: 'AE',
            scope: {ngModel:'=?'},
	        templateUrl: 'directive/templete/toggleBtn.html',
            controller: function ($scope, $element) {
                if($scope.ngModel=='TRUE'){
                    $scope.switch=true;
                }else if($scope.ngModel=='FALSE'){
                    $scope.switch=false;
                }
                $scope.$watch('ngModel', function (newValue,oldValue) {
                    if($scope.ngModel=='TRUE'){
                        $scope.switch=true;
                    }else if($scope.ngModel=='FALSE'){
                        $scope.switch=false;
                    }
                });
                $scope.toggleBtn=function(){
                    $scope.switch=!$scope.switch
                    if($scope.switch){
                        $scope.ngModel='TRUE';
                    }else{
                        $scope.ngModel='FALSE';
                    }
                }
               
            }
        };
    });
});