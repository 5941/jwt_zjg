define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("fullScroll", function($rootScope, $timeout) {
        return {
	        restrict: 'A',
	        link: function (scope, element) {
	            $timeout(function () {
	                element.slimscroll({
	                    height: '100%',
	                    railOpacity: 0.9
	                });

	            });
	        }
	    };
    });
});