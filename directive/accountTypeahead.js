var isComboTreeOut = true;
define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("accountTypeahead", function($rootScope, $timeout,UtilService,$compile,$state) {
        return {
            restrict: 'AE',
            scope: {ngModel:"=",data:"=",onSelect:'&',params:"=",options:'=?'},
	        template: '<input type="text" ng-model="ngModel"'+
                       ' typeahead-on-select="selectaccount($item, $model, $label, $event)"'+
                       ' placeholder="{{options.placeholder}}"'+
                       ' uib-typeahead="account.accountCode as (account.accountCode+\'-\'+account.accountName) for account in accounts | filter:{accountCode:$viewValue} | limitTo:8">',
            
			controller: function($scope, $element){  
                $scope.loadData = function(){
                    UtilService.httpRequestSync('framework_common/account', 'GET', {pageNumber:1,pageSize:1000,subDept:true}, 
                    function (data) {
                        $scope.accounts = data.data.datas;
                    });
                }

                $scope.loadData();

                $scope.selectaccount = function($item, $model, $label, $event){
                   
                    $scope.data = $item;
                    $scope.onSelect({$item:$scope.data});
                }
			},  
        };
    });
});