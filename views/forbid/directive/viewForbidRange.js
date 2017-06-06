define(['angularAMD', 'echarts', 'ol', 'om'],
    function (angularAMD, echarts, ol, om, factory) {
        angularAMD.directive("viewForbidRange",
            function ($rootScope, $timeout, UtilService) {
                return {
                    restrict: 'AE',
                    scope: { instance: "=?", passAreas: '=?'},
                    templateUrl: 'views/forbid/directive/viewForbidRange.html',
                    controller: function ($scope, $element) {
                        if(!$scope.instance)$scope.instance = {};
                        var isInited = false;
                        $scope.instance.init = function(){
                            if(isInited)return;
                            isInited = true;

                            $scope.om = new OpenMap();
                            $scope.om.init('view_forbid_range', omOptions);
                            $scope.instance.om = $scope.om;
                            $scope.instance.map = $scope.om._map;
                            map = $scope.om._map;

                            map.addLayer(drawlayer);
                        }

                        $scope.instance.redraw = function(passAreas){
                            $scope.instance.clearDraw();
                            for(var i in passAreas){
                                var passArea = passAreas[i];
                                var points = JSON.parse(passArea.pointList);
                                if (passArea.areaType == 'BROKEN_LINE')
                                    $scope.drawLine(points);
                                else
                                    $scope.drawRect(points);
                            }

                            map.getView().fit();
                        }

                        $scope.instance.clearDraw = function () {
                            drawlayer.getSource().clear();
                        }

                        //轨迹line layer
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

                        $scope.drawLine = function (points) {
                            var lineFeature = new ol.Feature({//路线
                                geometry: new ol.geom.LineString(points, 'XY')
                            });

                            drawlayer.getSource().addFeature(lineFeature);
                        }

                        $scope.drawRect = function (points) {
                            var rectFeature = new ol.Feature({//区域
                                geometry: new ol.geom.Polygon(points),
                            });

                            drawlayer.getSource().addFeature(rectFeature);
                        };
                    }
                }
            });
    });