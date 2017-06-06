define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("monthPicker", function($rootScope, $timeout,UtilService) {
        return {
            restrict: 'AE',
            scope: {ngModel:'=?',onSelect:'&',forbidMonth:'=?',editMonth:'=?'},
	        templateUrl: 'views/forbid/directive/monthPicker.html',
            controller: function ($scope, $element) {
                $scope.showSelect=false;
                $scope.allChecked=false;
                // $scope.startEdit=function(){
                //     if(!$scope.edit){
                //         for(var i in $scope.monthArray){
                //             for(var j in $scope.ngModel){
                //                 console.log($scope.monthArray[i].name.indexOf($scope.ngModel[j].configKey));
                //                 if($scope.monthArray[i].name.indexOf($scope.ngModel[j].configKey)==0){
                //                     $scope.monthArray[i].disabled=true;
                //                     console.log($scope.monthArray[i]);
                //                 }
                //             }
                //         }
                //     }else{
                //         for(var i in $scope.monthArray){
                //             for(var j in $scope.ngModel){
                //                 console.log($scope.monthArray[i].name.indexOf($scope.ngModel[j].configKey));
                //                 if($scope.monthArray[i].name.indexOf($scope.ngModel[j].configKey)==0){
                //                     $scope.monthArray[i].checked=true;
                //                 }
                //             }
                //         }
                //     }
                // }
                // $scope.startEdit();
                $scope.monthArray=[
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
                        for(var i in $scope.monthArray){
                            $scope.monthArray[i].checked=false
                        }

                    }
                });
                $scope.$watch('forbidMonth', function (newValue,oldValue) {
                    $scope.forbidMonth=newValue;
                    console.log(newValue);
                    for(var i in $scope.monthArray){
                        $scope.monthArray[i].disabled=false;
                        for(var j in $scope.forbidMonth){
                            if($scope.monthArray[i].name.indexOf($scope.forbidMonth[j])==0){
                                $scope.monthArray[i].disabled=true;
                                $scope.monthArray[i].checked=false;
                                break;
                            }
                        }
                    }
                });
                $scope.$watch('editMonth', function (newValue,oldValue) {
                   $scope.editMonth=newValue;
                   for(var i in $scope.monthArray){
                        for(var j in $scope.editMonth){
                            if($scope.monthArray[i].name.indexOf($scope.editMonth[j])==0){
                                $scope.monthArray[i].disabled=false;
                                $scope.monthArray[i].checked=true;
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
                $scope.selectYear=function($event){
                    $event.stopPropagation();
                    $scope.allChecked=!$scope.allChecked;
                    $scope.ngModel=[]; 
                    for(var i in $scope.monthArray){
                        if(!$scope.monthArray[i].disabled){
                            $scope.monthArray[i].checked=$scope.allChecked;
                            if($scope.monthArray[i].checked)
                                $scope.ngModel.push($scope.monthArray[i].name);
                        }
                    }

                }

              
                $scope.selectMonth = function(month,$event){
                    $event.stopPropagation();
                    if(month.disabled) return;
                    month.checked=!month.checked;
                    if(month.checked){
                        if($scope.ngModel.length>0){
                            for(var i in $scope.ngModel){
                                if($scope.ngModel[i]!= month.name){
                                    $scope.ngModel.push(month.name);
                                    break;
                                }
                            }
                        }else if($scope.ngModel.length==0){
                            $scope.ngModel.push(month.name)
                        }
                        
                     }else{
                        for(var i in $scope.ngModel){
                            if($scope.ngModel[i]==month.name){
                                $scope.removeByValue($scope.ngModel,$scope.ngModel[i])
                            };
                        }
                     }
                     console.log($scope.ngModel);
                        

                    for(var i in $scope.monthArray){
                        if($scope.monthArray[i].checked){
                            $scope.allChecked=true;
                        }else if(!$scope.monthArray[i].checked){
                            $scope.allChecked=false;
                            return;
                        }
                    }
                }
                $scope.removeMonth = function(month,$event){
                    $event.stopPropagation();
                    month.checked=false;
                    
                    for(var i in $scope.ngModel){
                        if($scope.ngModel[i]==month.name){
                            $scope.removeByValue($scope.ngModel,$scope.ngModel[i])
                        };
                    }
                    for(var i in $scope.monthArray){
                        if($scope.monthArray[i].checked){
                            $scope.allChecked=true;
                        }else if(!$scope.monthArray[i].checked){
                            $scope.allChecked=false;
                            return;
                        }
                    }
                }

                
            }
        };
    });
});