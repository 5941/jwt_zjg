define(['angularAMD', 'echarts', 'ol', 'om',
"views/forbid/directive/comboPoiSearch",],
    function (angularAMD, echarts, ol, om, factory) {
        angularAMD.directive("forbidMap",
            function ($rootScope, $timeout, UtilService) {
                return {
                    restrict: 'AE',
                    scope: { instance: "=?", passArea: '=?', canEdit: '@?' },
                    templateUrl: 'views/forbid/directive/forbidMap.html',
                    controller: function ($scope, $element) {
                        //初始化map
                        if (!$scope.instance) $scope.instance = {};
                        var map;
                        $scope.instance.init = function(){
                            $scope.om = new OpenMap();
                            $scope.om.init('forbid_map', omOptions);
                            $scope.instance.om = $scope.om;
                            $scope.instance.map = $scope.om._map;
                            map = $scope.om._map;

                            map.addLayer(drawlayer);
                            map.addLayer(tempEditLayer);

                            disableDoubleClickZoom();
                        };

                        $scope.createThumbImage = function(){
                            
                        }
                        
                        $scope.instance.loadFacilitys = function () {
                            UtilService.httpRequest('jwt_forbid/forbid/card/facility/all', 'GET', null, function (data) {
                                $scope.facilitys = data.data;
                                $scope.drawFacilitys();
                            });
                        };

                        $scope.instance.drawStartPoint = function (lon, lat) {
                            var options = {
                                'position': [lon, lat],
                                'image': 'views/forbid/img/icon_qidian.png',
                                'layer': '_forbidMapLayer',
                                'visible': true
                            };

                            $scope.om.addMarker(options);
                        };

                        $scope.instance.drawEndPoint = function (lon, lat) {
                            var options = {
                                'position': [lon, lat],
                                'image': 'views/forbid/img/icon_zhongdian.png',
                                'layer': '_forbidMapLayer',
                                'visible': true
                            };

                            $scope.om.addMarker(options);
                        }

                        $scope.instance.openDraw = function (type) {

                            $scope.om.openDraw(type, {
                                drawend: function (evt) {
                                    $scope.om.closeDraw();
                                    $scope.om.removeLayer('_drawLayer');

                                    var geometry = evt.feature.getGeometry();
                                    var points = geometry.getCoordinates();

                                    if ($scope.passArea.areaType == 'BROKEN_LINE')
                                        $scope.drawLine(points);
                                    else
                                        $scope.drawRect(points);

                                    $scope.passArea.pointList = JSON.stringify(points);

                                    $scope.editLine();
                                }
                            });
                        }

                        $scope.instance.clearDraw = function () {
                            tempEditLayer.getSource().clear();
                            drawlayer.getSource().clear();
                        }

                        $scope.instance.redraw = function(passArea){
                            $scope.instance.clearDraw();

                            var points = JSON.parse(passArea.pointList);
                            console.log(points);
                            if (passArea.areaType == 'BROKEN_LINE')
                                $scope.drawLine(points);
                            else
                                $scope.drawRect(points);
                        }

                        $scope.drawFacilitys = function () {
                            if ($scope.om.getLayer('_markerLayer')) {
                                $scope.om.getLayer('_markerLayer').getSource().clear();
                                //return;
                            }

                            for (var i in $scope.facilitys) {
                                var facility = $scope.facilitys[i];
                                var img = 'views/forbid/img/icon_camera_map.png';

                                if ($scope.passArea) {
                                    for (var j in $scope.passArea.facilityIdList) {
                                        if ($scope.passArea.facilityIdList[j] == facility.facilityId)
                                            img = 'views/forbid/img/camera_checked.png';
                                    }
                                }

                                var options = {
                                    'id': 'facilityMarkerId' + facility.facilityId,
                                    'position': [facility.lon, facility.lat],
                                    'image': img,
                                    'layer': '_markerLayer',
                                    'visible': true,
                                    'extData': facility,
                                    'onClick': function () {
                                        console.log($scope.canEdit);
                                        if ($scope.canEdit != 'true') return;
                                        var data = this.getProperties().extData;
                                        var exists = false;
                                        if ($scope.passArea) {
                                            for (var i in $scope.passArea.facilityIdList) {
                                                if ($scope.passArea.facilityIdList[i] == data.facilityId) {
                                                    exists = true;
                                                    $scope.passArea.facilityIdList.splice(i, 1);
                                                    break;
                                                }
                                            }
                                            if (!exists) $scope.passArea.facilityIdList.push(data.facilityId);
                                            $scope.drawFacilitys();
                                        }

                                    }
                                };

                                $scope.om.addMarker(options);
                            };
                        };

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

                        var tempEditSource = new ol.source.Vector({});

                        //临时图层，用来编辑节点
                        var tempEditLayer = new ol.layer.Vector({
                            source: tempEditSource,
                            // projection:myprojection,
                            name: "tmpEditLayer",
                            style: new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: 5,
                                    fill: new ol.style.Fill({
                                        color: '#2D9DEC'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: 'rgba(255, 255, 255, 0.6)'
                                    }),
                                    image: new ol.style.Circle({
                                        radius: 4,
                                        fill: new ol.style.Fill({
                                            color: '#FF0000'
                                        })
                                    })
                                })
                            })
                        });

                        //如果有选中则显示编辑样式，否则显示原样式
                        function toggleEditStyle() {
                            tempEditLayer.getSource().clear();

                            if (selectedFeature.getLength() <= 0) return;

                            currentFeature = selectedFeature.getArray()[0];
                            var cPnts = [];
                            var features = []
                            var len;

                            cPnts = currentFeature.getGeometry().getCoordinates();
                            len = cPnts.length;

                            for (var i = 0; i < len; i++) {
                                features[i] = new ol.Feature({ geometry: new ol.geom.Point(cPnts[i]), });
                            }
                            tempEditLayer.getSource().addFeatures(features);
                        }

                        //选中的feature所在数据源
                        var selectedFeature = new ol.Collection();

                        $scope.editLine = function () {
                            //选中事件
                            var editSelectFeature = new ol.interaction.Select({
                                condition: ol.events.condition.singleClick,
                                layers: [drawlayer],
                                style: new ol.style.Style({
                                    fill: new ol.style.Fill({
                                        color: 'rgba(255, 255, 255, 0.6)'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#5fcc2a',
                                        width: 4
                                    }),

                                })
                            });

                            $scope.om._map.addInteraction(editSelectFeature);

                            editSelectFeature.on('select', function (evt) {
                                //移除之前选中的
                                selectedFeature.forEach(function (feature) {
                                    if (!feature) {
                                        selectedFeature.remove(feature);
                                    }
                                });

                                //添加本次选中的
                                if (evt.selected.length > 0) {
                                    evt.selected.forEach(function (feature) {
                                        if (feature) {
                                            selectedFeature.push(feature);
                                        }
                                    });
                                }

                                //如果选中了则显示编辑样式
                                toggleEditStyle();
                            });

                            //编辑交互事件
                            var editFeatureInteraction = new ol.interaction.Modify({
                                features: selectedFeature,
                                style: new ol.style.Style({
                                    fill: new ol.style.Fill({
                                        color: 'rgba(255, 255, 255, 0.6)'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#5fcc2a',
                                    })
                                })
                            });

                            $scope.om._map.addInteraction(editFeatureInteraction);

                            var originalCoordinates = {};

                            editFeatureInteraction.on('modifyend', function (evt) {
                                if (!evt.features) return;

                                ol.Observable.unByKey(listener);

                                evt.features.forEach(function (feature) {

                                    if (feature in originalCoordinates) {

                                        delete originalCoordinates[feature];

                                        originalCoordinates[feature] = feature.getGeometry().getCoordinates();

                                        selectedFeature.remove(feature);
                                        selectedFeature.push(feature);

                                        toggleEditStyle();

                                        $scope.calcFacilitys(originalCoordinates[feature][0])
                                        console.log(originalCoordinates);

                                        $scope.passArea.pointList = JSON.stringify(originalCoordinates);
                                        $scope.passArea.thumbUrl = '';//需要重现创建截图

                                        console.log($scope.passArea.pointList);
                                    }

                                });
                            });

                            var listener;

                            editFeatureInteraction.on('modifystart', function (evt) {
                                if (!evt.features) return;

                                var sketch;
                                evt.features.forEach(function (feature) {
                                    originalCoordinates[feature] = feature.getGeometry().getCoordinates();
                                    sketch = feature;
                                });

                                listener = sketch.getGeometry().on('change', function (evt) {
                                    var geom = evt.target;
                                    toggleEditStyle();
                                });
                            });
                        };

                        //不激活DoubleClickZoom,绘图和编辑过程中都不需要激活
                        function disableDoubleClickZoom() {
                            var interactions = map.getInteractions();
                            var length = interactions.getLength();
                            for (var i = 0; i < length; i++) {
                                var item = interactions.item(i);
                                if (item instanceof ol.interaction.DoubleClickZoom) {
                                    item.setActive(false);
                                    break;
                                }
                            }
                        };

                        //激活DoubleClickZoom
                        function enableDoubleClickZoom() {
                            var interactions = map.getInteractions();
                            var length = interactions.getLength();
                            for (var i = 0; i < length; i++) {
                                var item = interactions.item(i);
                                if (item instanceof ol.interaction.DoubleClickZoom) {
                                    item.setActive(true);
                                    break;
                                }
                            }
                        };

                        $scope.calcFacilitys = function (points) {
                            var params = {
                                points: JSON.stringify(points),
                                areaType: $scope.passArea.areaType
                            };

                            UtilService.httpRequest('jwt_forbid/forbid/card/facility/list', 'GET', params, function (data) {
                                console.log(data);
                                $scope.drawFacilitys();
                            });
                        };

                        $scope.addPoint = function () {
                            $scope.onwayPoints.push({});
                        };

                        $scope.removePoint = function (index) {
                            $scope.onwayPoints.splice(index, 1);
                        };

                        $scope.toShowLinePanel = function (event) {
                            $scope.drawtype = 'line';
                            $scope.showLinePanel = true;
                            event.cancelBubble = true;
                            event.stopPropagation();
                        };

                        $scope.clickLinePanel = function (event) {
                            event.cancelBubble = true;
                            event.stopPropagation();
                        }

                        $element.bind('click', function (event) {
                            safeApply($scope, function () {
                                $scope.showLinePanel = false
                            });
                        });

                        $scope.buildLine = function () {
                            $scope.showLinePanel = false;
                        };

                        $scope.toDrawRect = function () {
                            //检查是否存在点，如果存在则不允许画线
                            var points = JSON.parse($scope.passArea.pointList);
                            if (points.length > 0) {
                                UtilService.toastError('请先清除原通行路线');
                                return;
                            };

                            $scope.passArea.areaType = 'AREA';

                            $scope.instance.openDraw('Polygon');
                        };

                        $scope.toBuildLine = function () {

                        };

                        $scope.toDrawLine = function (event) {
                            //检查是否存在点，如果存在则不允许画线
                            if(!$scope.passArea.pointList)$scope.passArea.pointList = '[]';
                            var points = JSON.parse($scope.passArea.pointList);
                            if (points.length > 0) {
                                UtilService.toastError('请先清除原通行路线');
                                return;
                            };

                            $scope.passArea.areaType = 'BROKEN_LINE';

                            $scope.toShowLinePanel(event);

                            $scope.instance.openDraw('LineString');
                        }

                        $scope.drawRect = function (points) {
                            var rectFeature = new ol.Feature({//区域
                                geometry: new ol.geom.Polygon(points),
                            });

                            drawlayer.getSource().addFeature(rectFeature);
                        };

                        $scope.drawLine = function (points) {
                            var lineFeature = new ol.Feature({//路线
                                geometry: new ol.geom.LineString(points, 'XY')
                            });

                            drawlayer.getSource().addFeature(lineFeature);
                        }

                        $scope.selectPoi = function(data){
                            map.getView().setCenter([data.lng,data.lat]);
                        };
                    }
                };
            });
    });