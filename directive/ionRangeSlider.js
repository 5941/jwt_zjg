define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("ionRangeSlider", function($rootScope, $timeout) {
        return {
	        restrict: 'A',
	        scope: {
	            rangeOptions: '='
	        },
	        link: function (scope, elem, attrs) {
	            elem.ionRangeSlider(scope.rangeOptions);
	        }
	    }
    });
});