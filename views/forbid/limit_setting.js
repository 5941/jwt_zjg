define(['jquery', 'angular','service/enumService','service/enumFilter'], function () {

    return ['$rootScope', '$scope', '$state', '$stateParams', 'UtilService','EnumService',
        function ($rootScope, $scope, $state, $stateParams, UtilService, EnumService) {
            $rootScope.$state = $state;
            
            $scope.limitTypes = [
            	{
            		value:"NONE",
            		name:"无限制"
            	},
            	{
            		value:"TIME",
            		name:"开启时间限制"
            	},
            	{
            		value:"SPACE",
            		name:"开启空间限制"
            	}
            ];
            
            //修改单车次数限制
            $scope.singleCarModify = function(){
            	UtilService.httpRequest('jwt_forbid/forbid/configuration/peak/evening', 'PUT',
		            {
		            	configValue:$scope.singleCarConfigValue
		            }, function(data){
		            });
            }
            
             //修改每日总限额
            $scope.dailyLimitModify = function(){
            	var url = "jwt_forbid/forbid/configuration/"+$scope.dailyLimitConfigValue+"/daily_limit";
            	UtilService.httpRequest(url, 'PUT',{}, function(data){
		        });
            }
            
            
            
            
        }
    ];
});