define(['angularAMD'], function (angularAMD) {
    angularAMD.directive("passTimeRange", ["UtilService", "$filter","$q",function (UtilService,$filter,$q) {
        return {
            restrict: 'AE',
            scope: {
            	passPeriodData:"=",
            	type:"@"
            },
            templateUrl: 'views/forbid/directive/passTimeRange.html',
            controller: function($scope, $element)  {
            	
            	$scope.defferObj = $q.defer();
            	$scope.tInstance={};
            	$scope.options={};
            	//通行证开始时间和结束时间
            	if($scope.passPeriodData.startTime){
            		$scope.startTime = new Date(new Date().format('yyyy-MM-dd') + ' ' + $scope.passPeriodData.startTime);
            	} else{
            		$scope.startTime = new Date(new Date().format('yyyy-MM-dd') + ' 00:00:00');
            	}
            	
            	if($scope.passPeriodData.endTime){
            		$scope.endTime = new Date(new Date().format('yyyy-MM-dd') + ' ' + $scope.passPeriodData.endTime);
            	} else{
            		$scope.endTime = new Date(new Date().format('yyyy-MM-dd') + ' 00:00:00');
            	}
            	
            	$scope.$watch("startTime", function(newVal){
					$scope.passPeriodData.startTime = newVal.format('hh:mm');
				});
				
				$scope.$watch("endTime", function(newVal){
					$scope.passPeriodData.endTime = newVal.format('hh:mm');
				});
				
				$scope.$watch("passPeriodData.sourceId", function(newVal){
					if(newVal != "-1" && newVal != "-2"){
						var singlePassPeriods = $filter('filter')($scope.passPeriods, {"passPeriodId":newVal});
						$scope.passPeriodData.passTimeRangeValue = singlePassPeriods.value;
					}
				});


				$scope.removeTimeRange = function(item){
            		item.remove();
            	}
				
				$scope.passTimeRangeValue = {};
            	
            	//查询通行时段
				$scope.getPassPeriod = function(){
					UtilService.httpRequest('jwt_forbid/forbid/configuration/pass_period', 'GET',
		            {
		            	pageNumber:1,
		            	pageSize:0
		            }, function(data){
		            	if(data.code == 0 && data.data.datas){
		            		$scope.passPeriods = data.data.datas;
		            	}
		            });
				}
				
				//查询早高峰配置
				$scope.getPeakMorning = function(){
					UtilService.httpRequest('jwt_forbid/forbid/configuration/peak/morning', 'GET',
		            {
		            }, function(data){
		            	if(data.code == 0 && data.data){
		            		$scope.peakMorning = data.data.peakGroup;
		            	}
		            });
				}
				
				//查询晚高峰配置
				$scope.getPeakEvening = function(){
					UtilService.httpRequest('jwt_forbid/forbid/configuration/peak/evening', 'GET',
		            {
		            }, function(data){
		            	if(data.code == 0 && data.data){
		            		$scope.peakEvening = data.data.peakGroup;
		            	}
		            });
				}
				
				$scope.getPassPeriod();
				$scope.getPeakMorning();
				$scope.getPeakEvening();
				
            },
            link: function(scope, element, attrs, ctrl){
               
            }
            
        };
    }]);
});