define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("closeOffCanvas", function($rootScope, $timeout) {
        return {
            restrict: 'A',
            template: '<a class="close-canvas-menu" ng-click="closeOffCanvas()"><i class="fa fa-times"></i></a>',
            controller: function ($scope, $element) {
                $scope.closeOffCanvas = function () {
                    $("body").toggleClass("mini-navbar");
                }
            }
        };
    });
});