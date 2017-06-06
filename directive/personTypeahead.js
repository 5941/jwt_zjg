var isComboTreeOut = true;
define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("personTypeahead", function($rootScope, $timeout,UtilService,$compile,$state) {
        return {
            restrict: 'AE',
            scope: {ngModel:"=",data:"=?",onSelect:'&',params:"=",options:'=?',dept:'=?'},
	        template: '<input type="text" placeholder="请输入警员姓名或警号" ng-model="ngModel"'+
                       ' typeahead-on-select="selectPerson($item, $model, $label, $event)"'+
                       ' placeholder="{{options.placeholder}}"'+
                       ' uib-typeahead="person.personCode as (person.personCode+\'-\'+person.personName) for person in persons | filter:{personCode:$viewValue} | limitTo:8">',
            
			controller: function($scope, $element){  
                $scope.loadData = function(){
                    var params = {pageNumber:1,pageSize:1000,subDept:true};
                    console.log($scope.dept);
                    if($scope.dept != null)params["deptId"] = $scope.dept.value;

                    UtilService.httpRequestSync('framework_common/person', 'GET', params, 
                    function (data) {
                        $scope.persons = data.data.datas;
                    });
                }

                $scope.$watch('dept', function (newValue,oldValue) {
                    $scope.loadData();
	            },true);

                $scope.selectPerson = function($item, $model, $label, $event){
                    $scope.data = $item;
                    $scope.onSelect({$item:$scope.data});
                }
			},  
        };
    });
});