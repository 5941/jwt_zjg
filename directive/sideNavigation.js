define(['angularAMD'], function (angularAMD, factory) {

    angularAMD.directive("sideNavigation", function($rootScope, $timeout) {
        return {
	        restrict: 'A',
	        link: function (scope, element) {
	            // Call the metsiMenu plugin and plug it to sidebar navigation
	            $timeout(function () {
					//在sidemenu中调用此功能
	                //element.metisMenu();
	            });
	        }
	    }
    });
});