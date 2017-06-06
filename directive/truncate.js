define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("truncate", function($rootScope, $timeout) {
        return {
	        restrict: 'A',
	        scope: {
	            truncateOptions: '='
	        },
	        link: function (scope, element) {
	            $timeout(function () {
	                element.dotdotdot(scope.truncateOptions);

	            });
	        }
	    };
    });
});