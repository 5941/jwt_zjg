define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("minimalizaSidebar", function($rootScope, $timeout) {
        return {
	        restrict: 'A',
	        //template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa {{arrow}}"></i></a>',
			template: '<i class="fa icon-nav" ng-click="minimalize()"></i>',
	        controller: function ($scope, $element) {
	            var left = 'fa-angle-double-left';
	            var right = 'fa-angle-double-right';
	            $scope.arrow = left;
	            $scope.minimalize = function () {
	                $("body").toggleClass("mini-navbar");
	                $(".big_nav_width").toggleClass("mini_nav_width");

	                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
	                    // Hide menu in order to smoothly turn on when maximize menu
	                    $('#side-menu').hide();
	                    // For smoothly turn on menu
	                    setTimeout(
	                        function () {
	                            $('#side-menu').fadeIn(400);
	                        }, 200);
	                } else if ($('body').hasClass('fixed-sidebar')) {
	                    $('#side-menu').hide();
	                    setTimeout(
	                        function () {
	                            $('#side-menu').fadeIn(400);
	                        }, 100);
	                } else {
	                    // Remove all inline style from jquery fadeIn function to reset menu state
	                    $('#side-menu').removeAttr('style');
	                }
	                if ($scope.arrow == left) {
	                    $scope.arrow = right;
	                } else {
	                    $scope.arrow = left;
	                }
	            }
	        }
	    };
    });
});