define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("markdownEditor", function($rootScope, $timeout) {
        return {
	        restrict: "A",
	        require: 'ngModel',
	        link: function (scope, element, attrs, ngModel) {
	            $(element).markdown({
	                savable: false,
	                onChange: function (e) {
	                    ngModel.$setViewValue(e.getContent());
	                }
	            });
	        }
	    }
    });
});