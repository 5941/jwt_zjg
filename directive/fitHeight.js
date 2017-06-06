define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("fitHeight", function($rootScope, $timeout) {
        return {
	        restrict: 'A',
	        link: function (scope, element) {
	            element.css("height", $(window).height() + "px");
	            element.css("min-height", $(window).height() + "px");
	            element.css("padding-top","50px");
	        }
	    };
    });
});