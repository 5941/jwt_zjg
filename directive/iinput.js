var isComboTreeOut = true;
define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("iinput", function($rootScope, $timeout,UtilService) {
        return {
            restrict: 'AE',
            scope: {ngModel:'='},
	        template: '<div class="search_input fl">'+
                      '      <input type="text" class=" noBorder" placeholder="请输入关键字">'+
                      '      <img src="/img/management/search.png">'+
                      '  </div>',
            controller: function ($scope, $element) {
                
                
            }
        };
    });
});