define([], function () {
    // controller
    return ['$rootScope', '$scope', '$state', 'UtilService',
        function ($rootScope, $scope, $state, UtilService ) {
            $scope.user = {username :getCookie('username'),password:""};

            $scope.login = function(){
                // 登录参数
				var params = {accountCode: $scope.user.username,password: $scope.user.password};
				
				// 成功返回
				var onSuccess = function(data){
						//if(data.data.account.photoThumb == null)data.data.account.photoThumb = "img/mine/pic_head-portrait.png";
						window.localStorage.accessToken = data.data.accessToken;
						window.localStorage.expiration = data.data.expiration;
						window.localStorage.account = JSON.stringify(data.data.account);
						$state.go('index');

						setCookie('username',$scope.user.username);
					};
				
				// 请求失败
				var onFailed = function(data){
					$(":password").focus();
					UtilService.toastError(data.message);
				}

				var onError = function(data){
					UtilService.toastError("后端服务连接失败");
				}
		
				UtilService.httpRequest('framework_common/auth','POST',params,onSuccess,onFailed,onError);
            }

            //用户名keydown
			$scope.myKeydown = function(e){
				if(e.keyCode == 13)$(":password").focus();
			}

			$scope.myKeydown2 = function(e){
				if(e.keyCode == 13)$scope.login();
			}
        }];
});