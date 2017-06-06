define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("chatSlimScroll", function($rootScope, $timeout) {
        return {
	        restrict: 'A',
	        link: function (scope, element) {
	            $timeout(function () {
	                element.slimscroll({
	                    height: '234px',
	                    railOpacity: 0.4
	                });

	            });
	        }
	    };
    });
});