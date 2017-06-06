define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("clockPicker", function($rootScope, $timeout) {
        return {
	        restrict: 'A',
	        link: function (scope, element) {
	            element.clockpicker();
	        }
	    };
    });
});