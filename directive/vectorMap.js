define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("vectorMap", function($rootScope, $timeout) {
        return {
	        restrict: 'A',
	        scope: {
	            myMapData: '=',
	        },
	        link: function (scope, element, attrs) {
	            var map = element.vectorMap({
	                map: 'world_mill_en',
	                backgroundColor: "transparent",
	                regionStyle: {
	                    initial: {
	                        fill: '#e4e4e4',
	                        "fill-opacity": 0.9,
	                        stroke: 'none',
	                        "stroke-width": 0,
	                        "stroke-opacity": 0
	                    }
	                },
	                series: {
	                    regions: [
	                        {
	                            values: scope.myMapData,
	                            scale: ["#1ab394", "#22d6b1"],
	                            normalizeFunction: 'polynomial'
	                        }
	                    ]
	                },
	            });
	            var destroyMap = function () {
	                element.remove();
	            };
	            scope.$on('$destroy', function () {
	                destroyMap();
	            });
	        }
	    }
    });
});