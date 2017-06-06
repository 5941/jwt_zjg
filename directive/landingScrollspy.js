define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("landingScrollspy", function($rootScope, $timeout) {
        return {
	        restrict: 'A',
	        link: function (scope, element, attrs) {
	            element.scrollspy({
	                target: '.navbar-fixed-top',
	                offset: 80
	            });
	        }
	    }
    });
});