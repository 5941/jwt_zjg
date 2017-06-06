define(["angularAMD", "angular","bootbox"], function (angularAMD, angular,bootbox) {
    // class
    var MapService = (function () {

        // constructors
        function MapService($rootScope,$uibModal,notify,cfpLoadingBar,UtilService) {
            
            self.$rootScope = $rootScope;
            self.$uibModal = $uibModal;
            self.notify = notify;
            self.cfpLoadingBar = cfpLoadingBar;
            self.UtilService = UtilService;
            $rootScope.goBack = function(){
                history.back();
            }
        }

        // methods
        MapService.prototype = {
            searchPois:function(keywords,onSuccess){
                var params = {pageNumber:1,pageSize:10,keywords:keywords};
                UtilService.httpRequest(baseMapUrl+"map_service/poi/keywords","GET",params,onSuccess);
            }
        }

        // return
        return MapService;
    })();
    angularAMD.service("MapService", ["$rootScope","$uibModal", "notify","cfpLoadingBar","UtilService",MapService]);
});
