/**
 * Created by lusm on 2016/11/18.
 */
define(['angularAMD'], function (angularAMD, factory) {
    /**
     * popTools - Directive for iBox tools elements in right corner of ibox
     */
    angularAMD.directive("popTools", function($rootScope, $timeout) {
        return {
            restrict: 'A',
            scope: false,
            templateUrl: 'views/common/pop_tools.html',
            controller: function ($scope, $element) {
                // Function for hide detail pop
                $scope.closePop = function () {
                    $scope.popShow = false;
                }
            }
        };
    });
});