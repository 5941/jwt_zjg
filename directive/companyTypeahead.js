define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("cpmpanyTypeahead", function($rootScope, $timeout,UtilService,$compile,$state) {
        return {
            restrict: 'AE',
            scope: {ngModel:"=",data:"=?",onSelect:'&',params:"=",options:'=?'},
	        template: '<input type="text" placeholder="请输入关键词" ng-model="ngModel"'+
                       ' typeahead-on-select="selectCompany($item, $model, $label, $event)"'+
                       ' placeholder="{{options.placeholder}}"'+
                       ' uib-typeahead="company.enterpriseId as (company.enterpriseId+\'-\'+company.enterpriseName) for company in companys | filter:{enterpriseId:$viewValue} | limitTo:8">',
            
			controller: function($scope, $element){  
                $scope.loadData = function(){
                    var params = {pageNumber:1,pageSize:0};

                    UtilService.httpRequestSync('key_vehicle/enterprise/page', 'GET', params, 
                    function (data) {
                        $scope.companys = data.data.datas;
                    });
                }


                $scope.selectCompany = function($item, $model, $label, $event){
                    $scope.data = $item;
                    $scope.onSelect({$item:$scope.data});
                }
			},  
        };
    });
});