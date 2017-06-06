define(['angularAMD'], function (angularAMD, factory) {

    angularAMD.directive("pager", function($rootScope, $timeout,$compile) {
        return {
            restrict: 'AE',
            templateUrl: 'directive/pager.html',
            scope: {
	            dtInstance: '='
	        },
            controller: function ($scope, $element) {
                //刷新表格
                $scope.refreshTable = function () {
                        $scope.dtInstance.reloadData(function () {
                    }, true);
                };

                $scope.changeSize = function(){
                    console.log('changeSize');
                    $scope.calcPageNums();
                    $scope.dtInstance.DataTable.page.len($scope.page.length).draw( 'page' );
                }

                $scope.changePage = function(page){
                    if(page == '...')return;
                    if(page == $scope.currentPage)return;
                    $scope.dtInstance.DataTable.page(page-1).draw( 'page' );
                    $scope.currentPage = $scope.dtInstance.DataTable.page()+1;
                    
                };

                $scope.goFirst = function(){
                    if($scope.currentPage<=1)return;
                    $scope.dtInstance.DataTable.page('first').draw( 'page' );
                };

                $scope.goPrior = function(){
                    if($scope.currentPage<=1)return;
                    $scope.dtInstance.DataTable.page('previous').draw( 'page' );
                };

                $scope.goNext = function(){
                    if($scope.currentPage>=$scope.page.max)return;
                    $scope.dtInstance.DataTable.page('next').draw( 'page' );
                };

                $scope.goLast = function(){
                    if($scope.currentPage>=$scope.page.max)return;
                    $scope.dtInstance.DataTable.page('last').draw( 'page' );
                };

                $scope.pageSizes = [
                    {value:10,name:'10条／每页'},
                    {value:20,name:'20条／每页'},
                    {value:30,name:'30条／每页'},
                    {value:40,name:'40条／每页'}
                ];
                    
                var buildPager = "";

                $scope.page = {total:0,max:0,length:20};
                $scope.disableFirst = true;
                $scope.disableNext = true;
                $scope.disablePrior = true;
                $scope.disableLast = true;
                $scope.pageNums = [];
                $scope.currentPage = 0;

                /*var html = '<div class="pager_select fr">'+
                '<a ng-class="{disabled:disableFirst}" class="fl" ng-click="goFirst()"><img src="img/framework/table_first.png"></a>'+
                '<a ng-class="{disabled:disablePrior}" class="fl" ng-click="goPrior()"><img src="img/framework/table_prior.png"></a>'+
                '<a ng-repeat="pageNum in pageNums track by $index" ng-click="changePage(pageNum)" ng-class="{active:currentPage == pageNum,disabled:pageNum== \'...\'}" class="fl">{{pageNum}}</a>'+
                '<a ng-class="{disabled:disableNext}" class="fl" ng-click="goNext()"><img src="img/framework/table_next.png"></a>'+
                '<a ng-class="{disabled:disableLast}" class="fl" ng-click="goLast()"><img src="img/framework/table_last.png"></a></div>'+
                '<div class="pager_select fr">'+
                '<select class="pager_select_drop" ng-change="changeSize()" ng-model="page.length" ng-options="pageSize.value as pageSize.name for pageSize in pageSizes">'+
                //'<option value="{{page.value}}" selected="page.value==pageSize" ng-repeat="page in pageSizes">{{page.name}}</option>'+
                '</select></label></div>'+
                '<div class="pager_total fr">共 {{page.total}} 笔数据</div>';*/

                //element.html($compile(html)($scope));

                // 计算页码
                $scope.calcPageNums = function(){
                    $scope.page.max = Math.floor(($scope.page.total+$scope.page.length-1)/$scope.page.length);

                    $scope.pageNums = [];
                    if($scope.page.max<=6){
                        for(var i=1;i<=$scope.page.max;i++){
                            $scope.pageNums.push(i);
                        }
                    }else{
                        if($scope.currentPage<=4){
                            for(var i=0;i<=4;i++){
                                $scope.pageNums.push(i+1);
                            }
                            $scope.pageNums.push('...');
                            $scope.pageNums.push($scope.page.max);
                        }else if($scope.currentPage>$scope.page.max-4){
                            $scope.pageNums.push(1);
                            $scope.pageNums.push('...');
                            for(var i=$scope.page.max-5;i<=$scope.page.max-1;i++){
                                $scope.pageNums.push(i+1);
                            }
                        }else{
                            $scope.pageNums.push(1);
                            $scope.pageNums.push('...');
                            for(var i=$scope.currentPage-1;i<=$scope.currentPage+1;i++){
                                $scope.pageNums.push(i);
                            }
                            $scope.pageNums.push('...');
                            $scope.pageNums.push($scope.page.max);
                        }
                    }
                }
                $scope.$watch('dtInstance', function() {
                    
                    if($scope.dtInstance == null) return;
                    
                    $('#'+$scope.dtInstance.id).on('xhr.dt', function ( e, settings, json, xhr ) {
                        $scope.$apply(function(){
                            $scope.currentPage = $scope.dtInstance.DataTable.page()+1;
                            
                            $scope.page.total =json.recordsFiltered;
                            $scope.page.length = settings._iDisplayLength;
                            
                            $scope.calcPageNums();

                            $scope.disableFirst = $scope.currentPage<=1;
                            $scope.disableNext = $scope.currentPage>=$scope.page.max;
                            $scope.disablePrior = $scope.currentPage<=1;
                            $scope.disableLast = $scope.currentPage>=$scope.page.max;
                        });
                    });
                });
            }
        }
    });
});