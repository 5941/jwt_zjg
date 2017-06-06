define(['angularAMD'], function (angularAMD, factory) {

    angularAMD.directive("topnavbar",function( $timeout,UtilService,$state) {
        return {
            restrict: 'AE',
            controller: function ($scope, $element,$uibModal) {
                $scope.avatar =JSON.parse(localStorage.getItem('account'))['photoThumb'];
                if($scope.avatar == null)$scope.avatar = 'img/management/icon_Head.png';

                var urlString = window.location.href;
                var shortUrl = urlString.substr(urlString.indexOf('#'),urlString.length);
                var urlArray = shortUrl.split('/');
                if(urlArray.length<3)
                    alert(urlString);
                $scope.moduleCode=urlArray[2];
                 UtilService.httpRequest('framework_common/permission/menu', 'GET', {moduleCode:$scope.moduleCode}, function(data){
                    for(var j in data.data){
                        if(data.data[j].menuUrl!=undefined){
                            $scope.moduleIndexUrl=data.data[j].menuUrl;
                            break;
                        }
                    }
                });

                $scope.getMusic = function(){
                    UtilService.httpRequest('jwt_vehicle/key_vehicle/alarm_remind_set','GET',null,function(data){
                        if(data.data.musicOpen){
                            $('#musicAlarm').attr('src',data.data.alarmUrl)
                        }else{
                            $('#musicAlarm').attr('src','')
                        }
                    })
                }

                

                $scope.getAlarm=function(){
                    var onSuccess = function(data){
                        if(data.data>0){
                            $scope.showMessage= true;
                            $scope.getMusic();
                        }else{
                            $scope.showMessage= false;
                        }
                    };

                    UtilService.httpRequest('jwt_vehicle/key_vehicle/car_alarm_info/update_number','GET',{
                        startTime:moment().subtract(10, 'seconds').format('YYYY-MM-DD HH:mm:ss'),
                        endTime:moment().format('YYYY-MM-DD HH:mm:ss')
                    },onSuccess,function(){})
                }
                if($scope.moduleCode=='key_vehicle'){
                    $scope.getAlarm();
                    // setInterval(function(){
                    //     $scope.getAlarm();
                    // },10000)
                }
                

                $scope.goAlarm = function(){
                    $('#musicAlarm').attr('src','');
                    $scope.showMessage= false;
                     $state.go('main.key_vehicle_monitor',{dialog_type:'alarmRemind'})
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

                $scope.logout = function(){
                    window.localStorage.clear();
                    window.location.href = "#/login";
                }
            }
        }
    });
});