define(['angularAMD'], function (angularAMD, factory) {

    angularAMD.directive("actionbtn",function($rootScope, $timeout,UtilService,$compile,$state) {
        return {
            restrict: 'AE',
            scope: {
	            action: '@'
	        },
            link: function (scope, element) {
                if(scope.action == null || scope.action == undefined){
                    return;
                }
                var strs = scope.action.split(".");
                if(strs.length<3)return;

                var moduleCode = strs[0];
                var menuCode = strs[1];
                var actionCode = strs[2];

                var onSuccess = function(data){
                    $rootScope.lastData = data;
                    if(data.data.length == 0)
                        element.replaceWith("");
                }
                if($rootScope.lastAction && $rootScope.lastAction == scope.action){
                    onSuccess($rootScope.lastData);
                }else{
                    $rootScope.lastAction = scope.action;
                    
                    UtilService.httpRequest('framework_common/permission/action', 'GET', {moduleCode: moduleCode, menuCode: menuCode,actionCode:actionCode}, onSuccess); 
                }
            }
        }
    });
});