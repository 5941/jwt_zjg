/**
 * Created by lusm on 2016/11/17.
 */
define(['jquery', 'angular'], function () {
    // controller
    return ['$rootScope', '$scope', '$state', '$stateParams',
        function ($rootScope, $scope, $state, $stateParams) {
            $scope.id = $stateParams.id;//页面中的$state的隶属于$rootScope
        }];
});
