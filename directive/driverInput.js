var isComboTreeOut = true;
define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("driverinput", function($rootScope, $timeout,UtilService) {
        return {
            restrict: 'AE',
            require : 'ngModel',
            scope: {ngModel:'=',options:'=?',ngRequired:"="},
	        template: '<input class="fl" type="text" ng-model="ngModel" placeholder="{{options.placeholder}}" name="{{options.name}}" ng-required="ngRequired" onkeyup="this.value=this.value.toUpperCase()" maxlength="20" style="width:100%" />',
            controller: function ($scope, $element) {
                
                
            }
        };
    });
});