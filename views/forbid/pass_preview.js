define(['jquery', 'angular'], function () {
    return ['$rootScope', '$scope', '$state', '$log', 'UtilService', '$timeout','$compile','notify',
        function ($rootScope, $scope, $state, $log, UtilService, $timeout,$compile,notify) {
            var imgUrl = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496736291059&di=b016b0711d2a7c92ee95a71e4a79e909&imgtype=0&src=http%3A%2F%2Fpic.35pic.com%2Fnormal%2F06%2F09%2F82%2F4247774_210515170385_2.jpg";
			$scope.upUrl = imgUrl;
			$scope.downUrl = imgUrl;
			
			$scope.showPreview = true;
			
			$scope.print = function(){
				
				var el = document.getElementById("passPrint");
				var iframe = document.createElement('IFRAME');
				var doc = null;
				iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
				document.body.appendChild(iframe);
				doc = iframe.contentWindow.document;
				doc.write('<div>' + el.innerHTML + '</div>');
				doc.close();
				iframe.contentWindow.focus();
				iframe.contentWindow.print();
				if (navigator.userAgent.indexOf("MSIE") > 0)
				{
				     document.body.removeChild(iframe);
				}
			}
			
        }];
});