define(["angularAMD", "angular","bootbox","ol"], function (angularAMD, angular,bootbox,ol) {
    // class
    var ConfigService = (function () {

        // constructors
        function ConfigService() {
        }

        window.baseApiUrl = 'http://192.168.3.97:8080/jwt_dev/';
        window.baseImageUrl = 'http://192.168.3.97:8080/jwt_dev/';
        window.baseMapUrl = 'http://192.168.3.97:8080/map_dev/';

        var omBaseMap = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'http://192.168.3.233:8888/geoserver/jszt/wms',
                params: {
                    'FORMAT': 'image/png',
                    'VERSION': '1.1.1',
                    'LAYERS': 'basemap',
                    'SRS': 'EPSG:4326'
                },
                crossOrigin: 'anonymous',
                tileGrid: ol.tilegrid.TileGrid({
                    //extent:bounds,
                    //00--07 level
                    minZoom: 8,
                    maxZoom: 19,
                    resolutions: [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625,
                        0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.433227539062E-4, 1.716613769531E-4, 8.58306884766E-5,
                        4.29153442383E-5, 2.14576721191E-5, 1.07288360596E-5, 5.3644180298E-6, 2.6822090149E-6, 1.3411045074E-6
                    ],
                    origin: [-180.0, 90.0]
                })
            })
            // extent:bounds
        });;

        var omProjection = new ol.proj.Projection({
            code: 'EPSG:4326',
            units: 'degrees',
        });

        window.omOptions = {
            center: [119.47961, 31.43408],
            zoom: 15,
            layers: [omBaseMap],
            projection: omProjection
        };

        // return
        return ConfigService;
    })();
    angularAMD.service("ConfigService", [ConfigService]);
});
