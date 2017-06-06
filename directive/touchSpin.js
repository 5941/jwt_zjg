define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("touchSpin", function($rootScope, $timeout) {
        return {
	        restrict: 'A',
	        scope: {
	            spinOptions: '='
	        },
	        link: function (scope, element, attrs) {
	            scope.$watch(scope.spinOptions, function () {
	                render();
	            });
	            var render = function () {
	                $(element).TouchSpin(scope.spinOptions);
	            };
	        }
	    }
    });
});