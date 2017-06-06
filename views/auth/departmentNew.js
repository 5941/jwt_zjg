/**
 * Created by lusm on 2016/11/14.
 */
define(['jquery', 'angular', 'jsTree', 'ngJsTree'], function () {
    // controller
    return ['$rootScope', '$scope', '$state', '$log',
        function ($rootScope, $scope, $state, $log) {
            $rootScope.$state = $state;//页面中的$state的隶属于$rootScope
        }
    ];
});