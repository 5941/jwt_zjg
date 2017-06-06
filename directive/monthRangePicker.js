define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("monthRangePicker", function($rootScope, $timeout,UtilService) {
        return {
            restrict: 'AE',
            scope: {start:'=?',end:'=?',onSelect:'&'},
	        templateUrl: 'directive/monthRangePicker.html',
            controller: function ($scope, $element) {
                var now = new Date();
                $scope.showSelect=false;


                if(now.getMonth()+1<10)
                    $scope.nowMonth='0'+(now.getMonth()+1);
                else
                    $scope.nowMonth=now.getMonth()+1;

                $scope.months=[];

                if(!$scope.start){
                    $scope.startYear = now.getFullYear();
                    $scope.startMonth=$scope.nowMonth;
                    $scope.start = $scope.startYear + '/' +$scope.startMonth;
                }else{
                    $scope.startYear=$scope.start.substring(0,4);
                    $scope.startMonth=$scope.start.substring(5,7);
                }
                if(!$scope.end){
                    $scope.endYear = now.getFullYear();
                    $scope.endMonth=$scope.nowMonth;
                    $scope.end = $scope.endYear + '/' +$scope.endMonth;
                }else{
                    $scope.endYear=$scope.end.substring(0,4);
                    $scope.endMonth=$scope.end.substring(5,7);
                }

                $scope.toggleSelect=function(){
                    if($scope.startYear+$scope.startMonth>$scope.endYear+$scope.endMonth){
                        UtilService.toastError('起始时间不能大于结束时间');
                        return;
                    }
                    $scope.showSelect=!$scope.showSelect
                }

                $scope.cutYear = function(type){
                    if(type==1){
                        if($scope.startYear==0) return;
                        $scope.startYear--;
                    }else{
                        if($scope.startYear>=$scope.endYear || $scope.endYear==0) return;
                        $scope.endYear--;
                    }
                        
                }
                $scope.addYear = function(type){
                    if(type==1){
                        if($scope.startYear>=$scope.endYear) return;
                        $scope.startYear++;
                    }else{
                        $scope.endYear++;
                    }
                        
                }
                for(var i =1; i<=12; i++){
                    if(i<10){ 
                        i = '0'+i;
                    }else{
                        i=i.toString();
                    }
                    $scope.months.push(i);
                }
                $scope.selectMonth = function(type,value){
                    if(type==1){
                        if($scope.startYear+value>$scope.endYear+$scope.endMonth) return;
                        $scope.startMonth=value;
                        $scope.start = $scope.startYear + '/' +$scope.startMonth;
                    }

                    if(type==0){
                        if($scope.endYear+value<$scope.startYear+$scope.startMonth) return;
                        $scope.endMonth=value;
                        $scope.end = $scope.endYear + '/' +$scope.endMonth;
                        $scope.toggleSelect();

                        $scope.onSelect({start:$scope.start,end:$scope.end});
                    }
                }

                
            }
        };
    });
});