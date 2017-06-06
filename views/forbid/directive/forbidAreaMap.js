define(['angularAMD', 'echarts', 'ol', 'om',
"views/forbid/directive/comboPoiSearch",],
    function (angularAMD, echarts, ol, om, factory) {
        angularAMD.directive("forbidAreaMap",
            function ($rootScope, $timeout, UtilService) {
                return {
                    restrict: 'AE',
                    scope: { instance: "=?", passArea: '=?', canEdit: '@?' },
                    templateUrl: 'views/forbid/directive/forbidAreaMap.html',
                    controller: function ($scope, $element) {
                        var isInited = false;
                        //初始化map
                        if (!$scope.instance) $scope.instance = {};
                        var map;

                        //line layer
                        var vsource = new ol.source.Vector({
                            type: 'LineString',
                            features: []
                        });

                        var getLayerStyle = function () {
                            return function (feature, resolution) {
                                var color = feature.get('color');

                                var style = new ol.style.Style({
                                    fill: new ol.style.Fill({
                                        color: 'rgba(255, 255, 255, 0.6)'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#5fcc2a',
                                        width: 4
                                    })
                                });
                                return [style];
                            }
                        };

                        var drawlayer = new ol.layer.Vector({
                            source: vsource,
                            style: getLayerStyle()
                        });

                        $scope.instance.init = function(){
                            if(isInited)return;
                            isInited = true;
                            $scope.om = new OpenMap();
                            $scope.om.init('forbid_area_map', omOptions);
                            $scope.instance.om = $scope.om;
                            $scope.instance.map = $scope.om._map;
                            map = $scope.om._map;

                            map.addLayer(drawlayer);
                        };

                        $scope.drawRect = function (points) {
                            var rectFeature = new ol.Feature({//区域
                                geometry: new ol.geom.Polygon(points),
                            });

                            drawlayer.getSource().addFeature(rectFeature);
                        };
                    }
                };
            });
    });