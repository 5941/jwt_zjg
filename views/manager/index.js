define(["jquery"], function () {
    // controller
    return ['$rootScope', '$scope', '$state', 'UtilService',
        function ($rootScope, $scope, $state, UtilService ) {

        	$scope.colors = {"test_alcohol":"#6c65f1","manager":'#2da81f',"key_vehicle":'#f79b26','attend_duty':'#e94967'};

        	UtilService.httpRequest('framework_common/permission/module','GET',null,function(data){
                $scope.modules=data.data;
        		for(var i in $scope.modules){
        			if($scope.colors[$scope.modules[i].moduleCode] == undefined) $scope.colors[$scope.modules[i].moduleCode] = "gray";
        		}
        	})


            var insertChildAtId = function (array,strId, objChild){
                found = false;
                for (var i = 0; i < array.length ; i++){
                    if (array[i].value.menuId == strId){
                        array[i].children.push(objChild);
                        return true;
                    }else if (array[i].children){
                        found = insertChildAtId(array[i].children,strId, objChild);
                        if (found) return true;
                    }
                }
                return false;
            };

            var buildHierarchy = function(source){
                var target = [];
                for (var i = 0 ; i < source.length ; i++)
                    target.push ({ "value": source[i], "children": []});

                i = 0;
                while (target.length>i){
                    if (target[i].value.parentMenuId){
                        insertChildAtId(target,target[i].value.parentMenuId, target[i]); 
                        target.splice(i, 1); 
                    }
                    else
                        i++;
                }
                return target;
            }


            $scope.goModule = function(module){
                UtilService.httpRequest('framework_common/permission/menu', 'GET', {moduleCode:module.moduleCode}, function(data){
                    var menuTreeData = buildHierarchy(data.data);

                    if(menuTreeData.length==0){
                        UtilService.toastError('当前用户无可用菜单');
                        return;
                    }
                    var url = menuTreeData[0].value.menuUrl;
                    if(!url){
                        url = menuTreeData[0].children[0].value.menuUrl;
                    }
                    if(module.hostUrlPrefix){
                        url = module.hostUrlPrefix + url+'?token='+window.localStorage.getItem('accessToken');
                    }
                    window.open(url);
                }); 
            }

            $('.index_bg').css({
            	height:$(window).height()
            });
            $(window).on('resize',function(){
            	$('.index_bg').css({
	            	height:$(window).height()
	            });
            });
            $scope.logout = function(){
                window.localStorage.clear();
                window.location.href = "#/login";
            }

            $scope.changePwd = function(){
                $uibModal.open({
                    templateUrl: 'views/framework/password_dialog.html',
                    size:'sg',
                    controller: function($scope, $uibModalInstance) {
                        $scope.params = {newPassword:'',oldPassword:''};

                        $scope.ok = function(){
                            
                            if($scope.params.oldPassword == ""){
                                UtilService.alert("请输入当前登陆密码");
                                return;
                            }

                            if($scope.params.newPassword == ""){
                                UtilService.alert("请输入新密码");
                                return;
                            }

                            if($scope.params.newPassword != $scope.newPassword2){
                                UtilService.alert("两次输入的密码不一致");
                                return;
                            }

                            var onSuccess = function(){
                                $uibModalInstance.close();
                                UtilService.alert("密码修改成功");

                                $scope.logout();
                            }
                            
                            UtilService.httpRequest('framework_common/account/password', 'PUT', {newPassword: $scope.params.newPassword, oldPassword: $scope.params.oldPassword}, onSuccess); 
                        };
                        $scope.cancel = function(){
                            $uibModalInstance.dismiss('cancel');
                        };
                    }
                });
            }
        }];
});