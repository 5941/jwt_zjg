define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("mapThumbnail", ["$q", "UtilService", "$timeout", function ($q, UtilService, $timeout) {
        return {
            restrict: 'AE',
            scope: { editArea:"=",deleteArea:"=",remark:"@" ,areaData:"=",options:"="},
            templateUrl: 'views/forbid/directive/mapThumbnail.html',
            controller: function ($scope, $element) {   
                $scope.imgClick=function(){
                    console.log("img");

                }
                $scope._option={
                    "equalScale":true,
                    "urlName":"thumbUrl",
                    "maskTextName":"areaName"
                }

                if($scope.options){
                    $.extend($scope._option,$scope.options)
                }
                $scope.controlClick=function(){
                    console.log("control")
                }

            }
        };
    }]);
});