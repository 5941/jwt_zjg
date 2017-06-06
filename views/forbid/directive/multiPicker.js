define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("monthPicker", function($rootScope, $timeout,UtilService) {
        return {
            restrict: 'AE',
            scope: {ngModel:'=?',onSelect:'&',forbidMonth:'=?',editMonth:'=?'},
	        templateUrl: 'views/forbid/directive/monthPicker.html',
            controller: function ($scope, $element) {
                $scope.showSelect=false;
                $scope.allChecked=false;

                $scope.dataArray=[
                    {checked:false,name:'一月'},
                    {checked:false,name:'二月'},
                    {checked:false,name:'三月'},
                    {checked:false,name:'四月'},
                    {checked:false,name:'五月'},
                    {checked:false,name:'六月'},
                    {checked:false,name:'七月'},
                    {checked:false,name:'八月'},
                    {checked:false,name:'九月'},
                    {checked:false,name:'十月'},
                    {checked:false,name:'十一月'},
                    {checked:false,name:'十二月'}
                ]
                $scope.removeByValue=function(arr, val) {
                    for(var i=0; i<arr.length; i++) {
                        if(arr[i] == val) {
                            arr.splice(i, 1);
                            break;
                        }
                    }
                }
                $scope.$watch('ngModel', function (newValue,oldValue) {
                    $scope.ngModel=newValue;
                    if(newValue==''){
                        for(var i in $scope.dataArray){
                            $scope.dataArray[i].checked=false
                        }

                    }
                });
                $scope.$watch('forbidMonth', function (newValue,oldValue) {
                    $scope.forbidMonth=newValue;
                    console.log(newValue);
                    for(var i in $scope.dataArray){
                        $scope.dataArray[i].disabled=false;
                        for(var j in $scope.forbidMonth){
                            if($scope.dataArray[i].name.indexOf($scope.forbidMonth[j])==0){
                                $scope.dataArray[i].disabled=true;
                                $scope.dataArray[i].checked=false;
                                break;
                            }
                        }
                    }
                });
                $scope.$watch('editMonth', function (newValue,oldValue) {
                   $scope.editMonth=newValue;
                   for(var i in $scope.dataArray){
                        for(var j in $scope.editMonth){
                            if($scope.dataArray[i].name.indexOf($scope.editMonth[j])==0){
                                $scope.dataArray[i].disabled=false;
                                $scope.dataArray[i].checked=true;
                                break;
                            }
                        }
                    }
                    $scope.ngModel=newValue;
                });
                

                $scope.toggleSelect=function($event){
                    $event.stopPropagation();
                    $scope.showSelect=!$scope.showSelect;
                    
                    // $scope.startEdit();
                    
                }
                $(document).on('click',function(){
                    safeApply($scope,function(){
                        $scope.showSelect=false;
                    })
                })
                $scope.toggleAll=function($event){
                    $event.stopPropagation();
                    $scope.allChecked=!$scope.allChecked;
                    $scope.ngModel=[]; 
                    for(var i in $scope.dataArray){
                        if(!$scope.dataArray[i].disabled){
                            $scope.dataArray[i].checked=$scope.allChecked;
                            if($scope.dataArray[i].checked)
                                $scope.ngModel.push($scope.dataArray[i].name);
                        }
                    }

                }

              
                $scope.selectItem = function(item,$event){
                    $event.stopPropagation();
                    if(item.disabled) return;
                    item.checked=!item.checked;
                    if(item.checked){
                        if($scope.ngModel.length>0){
                            for(var i in $scope.ngModel){
                                if($scope.ngModel[i]!= item.name){
                                    $scope.ngModel.push(item.name);
                                    break;
                                }
                            }
                        }else if($scope.ngModel.length==0){
                            $scope.ngModel.push(item.name)
                        }
                        
                     }else{
                        for(var i in $scope.ngModel){
                            if($scope.ngModel[i]==item.name){
                                $scope.removeByValue($scope.ngModel,$scope.ngModel[i])
                            };
                        }
                     }
                     console.log($scope.ngModel);
                        

                    for(var i in $scope.dataArray){
                        if($scope.dataArray[i].checked){
                            $scope.allChecked=true;
                        }else if(!$scope.dataArray[i].checked){
                            $scope.allChecked=false;
                            return;
                        }
                    }
                }
                $scope.removeItem = function(item,$event){
                    $event.stopPropagation();
                    item.checked=false;
                    
                    for(var i in $scope.ngModel){
                        if($scope.ngModel[i]==item.name){
                            $scope.removeByValue($scope.ngModel,$scope.ngModel[i])
                        };
                    }
                    for(var i in $scope.dataArray){
                        if($scope.dataArray[i].checked){
                            $scope.allChecked=true;
                        }else if(!$scope.dataArray[i].checked){
                            $scope.allChecked=false;
                            return;
                        }
                    }
                }

                
            }
        };
    });
});