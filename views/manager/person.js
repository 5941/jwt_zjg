define(['jquery', 'angular', 'jsTree', 'ngJsTree'], function () {
    // controller
    return ['$rootScope', '$scope', '$state', '$log', 'UtilService', '$timeout','$compile','notify',
        function ($rootScope, $scope, $state, $log, UtilService, $timeout,$compile,notify) {
            $scope.data = {};

            //条件输入区域的变量值
            $scope.inputs = {
                personCode: "",
                phone: "",
                selectSexual: "",
                personKind: {
                    personKindId:'',
                    personKindName:'全部'
                },
                check_subDept: true
            };
            $scope.selectPerson = function($item){
                $scope.inputs.personCode=$item.personCode;
                $scope.refreshTable();
            }
            // 监听选择树节点事件
            $scope.onTreeSelect = function(){
                $scope.select_node_id = $scope.deptnode.deptId;
                $scope.refreshTable();
           }
           // 监听选择树节点事件
            $scope.onTreeSelect2 = function(){
                $scope.select_node_id = $scope.dept.data.deptId;
                $scope.refreshTable();
           }

            $scope.selectSearchType = function (item) {
                $scope.sex_type = "全部";
                $scope.inputs = {
                    personCode: "",
                    phone: "",
                    selectSexual: "",
                    personKind: {
                        personKindId:'',
                        personKindName:'全部'
                    },
                    check_subDept: true
                };
                $scope.search_type = item;
            };
            $scope.search_type = "警员";
            $scope.search_types = ["警员", "性别", "人员类型", "管理部门"];

            //性别筛选
            $scope.selectSexType = function (item,refresh) {
                $scope.sex_type = item;
                if(refresh)$scope.refreshTable();
            };

            $scope.selectPersonKind= function (item,refresh) {
                $scope.inputs.personKind = item;
                if(refresh)$scope.refreshTable();
            };
            $scope.sex_type = "全部";
            $scope.sex_types = ["全部","男", "女"];

            // 加载人员类型可选项
            UtilService.httpRequest('framework_common/person_kind', 'GET', {
                "pageNumber": 1,
                "pageSize": 10
            }, function (result) {
                
                $scope.$apply(function () {
                    $scope.personKinds = result.data.datas;
                    $scope.personKinds.unshift({
                        personKindId:'',
                        personKindName:'全部'
                    })
                });
            });


            //点击进入新增页面
            $scope.openNew = function () {
                $state.go('update.person',{'id':-1,superDept:$scope.select_node_id});
            };
            //点击进入编辑页面
            $scope.openEdit = function (id) {
                $state.go('update.person',{'id':id});
            };
            //打开自定义页面
            $scope.openColumnDef = function(){
                UtilService.openColumnDef($scope.dtColumns);
            }

            //刷新表格
            $scope.refreshTable = function () {
                    $scope.dtInstance.reloadData(function () {
                }, true);
            };

            //表格
            $scope.dtInstance = {};

            //表格选项定义
            $scope.dtOptions = {
                "processing": true,
                "serverSide": true,
                "order":[[1,"desc"]],
                "autoWidth":true,
                "createdRow":function(row, data, dataIndex) {
                    $('td', row).attr("ng-class","{table_select_bg:selectedRows["+data.personId+"]}");
                    $compile(angular.element(row).contents())($scope);
                },
                "ajax": function (source, callback, settings) {
                    var onSuccess = function (data) {
                        var result = data.data.datas;

                        //todo 针对字段值不全的情况
                        $.each(result, function (i, e) {
                            e.deptCode = e.deptCode || "";
                            e.deptId = e.deptId || "";
                            e.deptName = e.deptName || "";
                            e.personCode = e.personCode || "";
                            e.personName = e.personName || "";
                            e.personKindId = e.personKindId || "";
                            e.sex = e.sex && (e.sex == 'MALE' ? '男' : '女') || "";
                            e.phone = e.phone || "";
                        });

                        result.recordsTotal = data.data.totalRecords;
                        result.recordsFiltered = data.data.totalRecords;
                        $scope.allSelected = false;
                        $scope.selectedRows = [];
                        callback(result);
                    };

                    if($scope.sex_type=='男'){
                        $scope.inputs.selectSexual='MALE'
                    }else if($scope.sex_type=='女'){
                        $scope.inputs.selectSexual='FEMALE'
                    }else{
                        $scope.inputs.selectSexual=''
                    }

                    UtilService.httpRequest('framework_common/person', 'GET',
                        {
                            pageNumber: source.start / source.length + 1,
                            pageSize: source.length,
                            deptId: $scope.select_node_id || "",
                            personCodeOrName: $scope.inputs.personCode || "",
                            phone: $scope.inputs.phone || "",
                            sex: $scope.inputs.selectSexual || "",
                            personKindId: $scope.inputs.personKind.personKindId || "",
                            subDept: $scope.inputs.check_subDept,
                            orderProperty:source.order.length==0?null:source.columns[source.order[0].column].data,
                            orderType:source.order.length==0?null:source.order[0].dir.toUpperCase()
                        }, onSuccess);
                },
                "headerCallback":function(header){
                    $compile(angular.element(header).contents())($scope);
                },
                "rowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    $('td:not(:first-child):not(:last-child)', nRow).unbind('click');
                    $('td:not(:first-child):not(:last-child)', nRow).bind('click', function () {
                        UtilService.httpRequest('framework_common/person/' + aData.personId, 'GET', {},
                            function (data) {
                                $scope.$apply(function () {
                                    var result  = data.data;
                                    result.sex = result.sex && (result.sex == 'MALE' ? '男' : '女') || "";
                                    $scope.detail = result;
                                    $scope.popShow = true;
                                });
                            }
                        );
                    });
                    return nRow;
                }
            };

            $scope.closePop = function(){
                $scope.popShow = false;
            };

            //列定义
            $scope.dtColumns = [
                {
                    bSortable:false,sClass:'select-checkbox',mData:null,
                    sTitle:'<input type="checkbox" ng-click="toggleAll()" ng-model="allSelected"/>',
                    mRender:function(data, type, full, meta){
                        $scope.selectedRows[data.personId] = false;
                        return '<input type="checkbox" ng-click="toggleOne()" ng-model="selectedRows['+data.personId+']"/>';
                    }
                },
                {sTitle:"人员代码",mData:"personCode","sDefaultContent" : "",bCanHidden:false},
                {sTitle:"人员姓名",mData:"personName","sDefaultContent" : "",bCanHidden:false},
                {sTitle:"性别",mData:"sex","sDefaultContent" : ""},
                {sTitle:"人员类型",mData:"personKindName","sDefaultContent" : ""},
                {sTitle:"管理部门",mData:"deptName","sDefaultContent" : ""},
                {sTitle:"联系方式",mData:"phone","sDefaultContent" : ""},
                {sTitle:"操作",mData:null,bSortable:false,
                    mRender:function (data, type, full, meta) {
                        return "<a href='javascript:void(0);' ng-click='openEdit("+data.personId+")' actionbtn action='manager.person.edit'>编辑</a>";
                    }
                },
            ];  

            // 多选删除
            $scope.selectedRows = [];
            $scope.allSelected = false;
            $scope.toggleAll = function () {
                for (var id in $scope.selectedRows) {
                    if ($scope.selectedRows.hasOwnProperty(id)) {
                        $scope.selectedRows[id] = $scope.allSelected;
                    }
                }
            };

            $scope.toggleOne = function () {
                for (var id in $scope.selectedRows) {
                    if ($scope.selectedRows.hasOwnProperty(id)) {
                        if(!$scope.selectedRows[id]) {
                            $scope.allSelected = false;
                            return;
                        }
                    }
                }
            };

            //选中个数
            $scope.selectedCount = function(){
                var result = 0;
                for (var id in $scope.selectedRows) {
                    if ($scope.selectedRows.hasOwnProperty(id) && $scope.selectedRows[id]) {
                        result++;
                    }
                }
                return result;
            }

            $scope.deleteRows = function(){
                var rows = [];
                for (var id in $scope.selectedRows) {
                    if ($scope.selectedRows.hasOwnProperty(id) && $scope.selectedRows[id]) {
                        rows.push(id);
                    }
                }

                var callback = function(res){
                    if(!res)return;

                    UtilService.httpRequest('framework_common/person/', 'DELETE',rows, function(){
                        $scope.dtInstance.reloadData(function () {}, false);
                    });
                };

                
                if(rows.length>0)UtilService.confirm("删除确认","确定要删除所选人员吗？",callback);
            }
        }];
});