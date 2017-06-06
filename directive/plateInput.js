define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("plateinput", function($rootScope, $timeout,UtilService,$compile) {
        return {
            restrict: 'AE',
            scope: {ngModel:'=',options:'=?',ngRequired:"="},
            require : 'ngModel',
	        template: 
                      '          <div class="area_select fl" ng-click="menuShow=!menuShow">'+
                      '              {{area}}<span class="caret" ng-class="{area_drop:menuShow}"></span>'+
                      '          </div>'+

                      '          <div class="area_select_menu" ng-show="menuShow">'+
                      '             <ul>'+
                      '                 <li ng-click="select_area(area);" ng-repeat="area in areas">{{area}}</li>'+
                      '             </ul>'+
                      '          </div>'+
                      '          <input class="area_plate fl" ng-required="ngRequired" type="text" name="{{options.name}}" onkeyup="this.value=this.value.toUpperCase()" placeholder="{{options.placeholder}}" ng-model="plateCode" maxlength="8">',
            controller: function ($scope, $element) {
                $scope.areas = ['京','沪','津','翼','晋','蒙','辽','吉','黑','苏','浙','皖','闽','赣','鲁','豫','鄂','湘','粤','桂','琼','渝','川','贵','云','藏','陕','甘','青','宁','新','台'];
                $scope.defaultArea='苏';
                $scope.area= $scope.defaultArea;
                $scope.menuShow=false;
                $scope.value = "";
                $scope.plateCode = "";
                $scope.required = true;
                
                $scope.select_area = function(item){
                    $scope.area = item;
                    $scope.menuShow=false;
                    if($scope.plateCode == "") 
                        $scope.ngModel = "";
                    else
                        $scope.ngModel = $scope.area + $scope.plateCode;
                }

                $(document).bind('click',function(){
                    safeApply($scope,function(){
                        $scope.menuShow = false;
                    });
                });

                $element.bind('click',function(){
                    event.cancelBubble=true;
                });

                $scope.$watch('ngModel', function (newValue,oldValue) {
                    if($scope.value == newValue)return;
                    newValue = newValue || $scope.defaultArea;

                    if(newValue == ""){
                        $scope.area = $scope.defaultArea;
                        $scope.plateCode = "";
                        return;
                    }

                    //if(newValue.length<7) newValue = "";
                    
                    $scope.area = newValue.substr(0,1);
                    $scope.plateCode = newValue.substr(1,newValue.length-1);
	            });
                
                $scope.$watch('plateCode', function (newValue,oldValue) {
                    if($scope.options && $scope.options.required){
                        //if(newValue == '').$setValidity('empty',false); 
                    }
                    $scope.value = $scope.area + newValue;
                    if($scope.plateCode == "") 
                        $scope.ngModel = "";
                    else
                        $scope.ngModel = $scope.area + $scope.plateCode;
	            });
            }
        };
    });
});