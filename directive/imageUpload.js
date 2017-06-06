var imageuploadIndex = 1;
define(['angularAMD'], function (angularAMD, factory) {

    angularAMD.directive("imageupload",function($rootScope, $timeout,UtilService,$compile,$state) {
        return {
            restrict: 'AE',
            scope: {
                defaultImg:'=?',
                ngModel:'=?',
                target:'=?'
	        },
            template: '<img id={{id}}></img>',
            replace: true,
            link:function($scope, $element){
                $scope.id = 'imageupload_'+(imageuploadIndex++);
                console.log($scope.defaultImg);

                if(!$scope.target)$scope.target = $scope.id;
                if(!$scope.defaultImg)$scope.defaultImg = '';

                $scope.inputHtml = '<input id="'+$scope.id+'_file'+'" name="files" type="file" style="display: none">';
                $(document.body).append($scope.inputHtml);

                $timeout(function(){
                    $('#'+$scope.id).on("click",function(){
                        $("#"+$scope.id+'_file').click();
                    });

                    $("#"+$scope.id+'_file').bind('change',$scope.uploadImg);
                });
            },
            controller: function($scope, $element){
                $scope.$watch('ngModel', function (newValue, oldValue) {
                    console.log($scope.defaultImg);
                    if(newValue!='')
                        $("#"+$scope.target).attr('src',newValue);
                    else
                        $("#"+$scope.target).attr('src',$scope.defaultImg);
                });
                $scope.uploadImg = function(){
                    var onSuccess = function(data){
                        $scope.ngModel = data.data[0];

                        $("#"+$scope.id+'_file').replaceWith($scope.inputHtml);
                        $("#"+$scope.id+'_file').bind('change',$scope.uploadImg);
                    };

                    var onFailed = function(data){
                        UtilService.prototype.alert(data.message);
                        $("#"+$scope.id+'_file').replaceWith($scope.inputHtml);
                        $("#"+$scope.id+'_file').bind('change',$scope.uploadImg);
                    };
                    UtilService.uploadImg($scope.id+'_file',onSuccess);
                }
            }
        }
    });
});
