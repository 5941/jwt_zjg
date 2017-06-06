/**
 * Created by lusm on 2016/11/14.
 */
define(['jquery', 'angular', 'jsTree', 'ngJsTree'], function () {
    // controller
    return ['$rootScope', '$scope', '$state','$stateParams','UtilService',
        function ($rootScope, $scope, $state, $stateParams,UtilService) {
            
            $rootScope.$state = $state;
            $scope.disabled=false;
            // 加载可选项
            $scope.person = {
                sex: 'MALE',
                deptId: $state.params.deptId == null?0:$state.params.deptId
            };
            //加载人员列表
            $scope.loadPerson = function(){
                UtilService.httpRequest('framework_common/person', 'GET', {pageNumber:1,pageSize:1000,subDept: true}, 
                function (data) {
                    $scope.$apply(function () {
                        $scope.persons = data.data.datas;
                    });
                });
            }

            //加载角色列表
            $scope.treeConfig = UtilService.getEditableTreeConfig();
            $scope.buildTree = function(){
                UtilService.httpRequest('framework_common/role', 'GET', {pageNumber:1,pageSize:1000,roleTypes:['PARENT_AUTHORIZED','DEPT_CREATED']},function(data){
                    var treeData = [];
                    for (var i in data.data.datas) {
                        var role = data.data.datas[i];

                        //检查角色是否已勾选
                        var checked = false;
                        for (var j in $scope.detail.accountRoles){
                            var role2 = $scope.detail.accountRoles[j];
                            if(role2.roleId == role.roleId){
                                checked = true;
                                break;
                            }
                        }
                        treeData.push({
                            "id": role.roleId,
                            "parent":'#', //(i ==0 || role.parentRoleId == undefined)?'#':role.parentRoleId,
                            "text": role.roleName,
                            "data":"menu",
                            "state": {
                                "opened": true,
                                "checked":checked
                            }
                        });
                    }
                    
                    $scope.$apply(function(){
                        console.log(treeData);
                        $scope.treeData = treeData;
                        $scope.treeConfig.version++;
                    });
                });
            }

            $scope.selectPerson = function($item, $model, $label, $event){
                $scope.detail.accountName = $item.personName;
                $scope.detail.accountId = $item.personId;
                $scope.detail.accountCode = $item.personCode;
                $scope.detail.deptId = $item.deptId;
                $scope.detail.deptName = $item.deptName;
            }

            $scope.selectDept = function(){
                //加载人员列表
                $scope.loadPerson();
                $scope.detail.accountCode = '';
                $scope.detail.accountName = '';
                $scope.detail.accountId = '';
            }

            // 加载数据
            $scope.action = "新增";
            if($state.params.id != -1){
                $scope.disabled=true;
                UtilService.httpRequest('framework_common/account/'+$state.params.id, 'GET', {}, 
                function (data) {
                    $scope.$apply(function () {
                        $scope.detail = data.data;
                        $scope.dept = {value:$scope.detail.deptId,text:$scope.detail.deptName};
                        $scope.personCode = $scope.detail.accountCode;
                        $scope.buildTree();
                    });
                });
                $scope.action = "编辑";
            }else{
                $scope.detail = {'isAdmin':'FALSE','enable':'TRUE'};
                $scope.buildTree();
                //加载部门名称
                var deptId = $state.params.deptId == null?0:$state.params.deptId;

                UtilService.httpRequest('framework_common/dept/'+deptId, 'GET', {}, 
                function (data) {
                    $scope.$apply(function () {
                        $scope.dept = {value:data.data.deptId,text:data.data.deptName};;
                        console.log($scope.dept);
                        //加载人员列表
                        $scope.loadPerson();
                    });
                });
            }

            //重置密码
            $scope.doReset = function(){

                var callback = function(res){
                    if(!res)return;

                    UtilService.httpRequest('/framework_common/account/'+$state.params.id+'/reset_password', 'PUT',null, function(){
                        UtilService.toastSuccess('重置密码成功');
                    });
                };

                
                UtilService.confirm("密码重置","确认重置密码？重置后密码为888888",callback);
            }


            // 保存
            $scope.doSave = function () {
                if (!$('#data-form').parsley().validate()) return;

                if($scope.personCode != $scope.detail.accountCode){
                    UtilService.alert('请选择人员！');
                    return;
                }
                //取得选中的节点
                var nodes = $scope.treeInstance.jstree().get_checked();
                $scope.detail.accountRoles = [];
                for(var i in nodes){
                    $scope.detail.accountRoles.push({
                        roleId:nodes[i]
                    });
                }
               
                $scope.detail.deptId = $scope.dept.value;
                UtilService.httpRequest(
                    'framework_common/account',
                    $state.params.id==-1?'POST':'PUT',
                    $scope.detail,
                    function (result) {
                        UtilService.toastSuccess('用户保存成功！');
                        $state.go("main.account");
                    }
                );
            };
        }
    ];
});