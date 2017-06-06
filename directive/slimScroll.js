define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("slimScroll", function($rootScope, $timeout) {
        return {
	        restrict: 'A',
	        scope: {
	            boxHeight: '@'
	        },
	        link: function (scope, element) {
	            $timeout(function () {
	                element.slimscroll({
	                    height: scope.boxHeight,
	                    railOpacity: 0.9
	                });

	            });
	        }
	    };
    });
});