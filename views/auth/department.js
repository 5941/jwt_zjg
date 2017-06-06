define(['jquery', 'angular', 'jsTree', 'ngJsTree',"datatables"], function () {
    // controller
    return ['$rootScope', '$scope', '$state', '$log',
        function ($rootScope, $scope, $state, $log ) {
            $rootScope.$state = $state;//页面中的$state的隶属于$rootScope
            $scope.data = {
                departId: '100002233',
                departName: '贵阳交警大队',
                departFullName: '贵阳市公安局交通警察支队',
                parentDepart: '贵州省交警总队'
            };
            //配置树
            $scope.treeConfig = {
                'plugins': ['types', 'search'],
                'search': {
                    show_only_matches: true,
                    show_only_matches_children: true
                },
                'types' : {
                    'default' : {
                        'icon' : 'fa fa-folder'
                    },
                    'html' : {
                        'icon' : 'fa fa-file-code-o'
                    },
                    'svg' : {
                        'icon' : 'fa fa-file-picture-o'
                    },
                    'css' : {
                        'icon' : 'fa fa-file-code-o'
                    },
                    'img' : {
                        'icon' : 'fa fa-file-image-o'
                    },
                    'js' : {
                        'icon' : 'fa fa-file-text-o'
                    }
                }
            };
            $scope.doSelect = function(item){
                $scope.currentLi = item;
                $log.info('ss');
            };
            $scope.currentLi = "人员姓名";
            $scope.li=["人员姓名","性别","人员类型","管理部门"];
            $scope.treeData = [
                {
                    "id": "ajson1",
                    "parent": "#",
                    "text": "贵阳交警总队",
                    "state": {
                        "opened": true
                    }
                }, {
                    "id": "ajson2",
                    "parent": "ajson1",
                    "text": "贵阳交警支队一",
                    "state": {
                        "opened": true
                    }
                }, {
                    "id": "ajson3",
                    "parent": "ajson2",
                    "text": "车辆管理所",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson4",
                    "parent": "ajson2",
                    "text": "政治处",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson5",
                    "parent": "ajson2",
                    "text": "秩序科",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson6",
                    "parent": "ajson1",
                    "text": "贵阳交警支队二",
                    "state": {
                        "opened": false
                    }
                },
                {
                    "id": "ajson7",
                    "parent": "ajson6",
                    "text": "车辆管理所",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson88",
                    "parent": "ajson6",
                    "text": "政治处",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson9",
                    "parent": "ajson6",
                    "text": "秩序科",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson10",
                    "parent": "ajson6",
                    "text": "审查科",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson30",
                    "parent": "ajson1",
                    "text": "贵阳交警支队三",
                    "state": {
                        "opened": false
                    }
                },
                {
                    "id": "ajson31",
                    "parent": "ajson30",
                    "text": "车辆管理所",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson32",
                    "parent": "ajson30",
                    "text": "政治处",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson33",
                    "parent": "ajson30",
                    "text": "秩序科",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson34",
                    "parent": "ajson30",
                    "text": "审查科",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson40",
                    "parent": "ajson1",
                    "text": "贵阳交警支队四",
                    "state": {
                        "opened": false
                    }
                },
                {
                    "id": "ajson41",
                    "parent": "ajson40",
                    "text": "车辆管理所",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson42",
                    "parent": "ajson40",
                    "text": "政治处",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson43",
                    "parent": "ajson40",
                    "text": "秩序科",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson44",
                    "parent": "ajson40",
                    "text": "审查科",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson50",
                    "parent": "ajson1",
                    "text": "贵阳交警支队五",
                    "state": {
                        "opened": false
                    }
                },
                {
                    "id": "ajson51",
                    "parent": "ajson50",
                    "text": "车辆管理所",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson52",
                    "parent": "ajson50",
                    "text": "政治处",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson53",
                    "parent": "ajson50",
                    "text": "秩序科",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson54",
                    "parent": "ajson50",
                    "text": "审查科",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson60",
                    "parent": "ajson1",
                    "text": "贵阳交警支队六",
                    "state": {
                        "opened": false
                    }
                },
                {
                    "id": "ajson61",
                    "parent": "ajson60",
                    "text": "车辆管理所",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson62",
                    "parent": "ajson60",
                    "text": "政治处",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson63",
                    "parent": "ajson60",
                    "text": "秩序科",
                    "state": {
                        "opened": true
                    }
                },
                {
                    "id": "ajson64",
                    "parent": "ajson60",
                    "text": "审查科",
                    "state": {
                        "opened": true
                    }
                }
            ];
            //控制查询操作
            var to = false;
            $scope.search = function () {
                if (to) {
                    clearTimeout(to);
                }
                to = setTimeout(function () {
                    $scope.treeInstance.jstree().search($scope.data.keyword);
                }, 300);
            };
            //点击进入新增页面
            $scope.openNew = function () {
                $state.go('auth.departmentNew');
            };
            $scope.openDetail = function (id) {
                $state.go('auth.departmentDetail/:' + id);
            };

            $scope.options = {
                searching:false,
                bLengthChange:false,
                bInfo:false
            };

            $scope.selectedItem = [];
            $scope.popShow = false;
            // $scope.$watch('selectedItem', function (newValue, oldValue) {
            //     console.log(newValue);
            //     $scope.popShow = $scope.selectedItem.length > 0;
            // }, true);
            //
            // $scope.ngOptions = {
            //     data: 'ngData',
            //     multiSelect: false,
            //     selectedItems: $scope.selectedItem
            // };
            /*
            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withDOM('<"html5buttons"B>lTfgitp')
                .withButtons([
                    {extend: 'copy'},
                    {extend: 'csv'},
                    {extend: 'excel', title: 'ExampleFile'},
                    {extend: 'pdf', title: 'ExampleFile'},

                    {extend: 'print',
                        customize: function (win){
                            $(win.document.body).addClass('white-bg');
                            $(win.document.body).css('font-size', '10px');

                            $(win.document.body).find('table')
                                .addClass('compact')
                                .css('font-size', 'inherit');
                        }
                    }
                ]);*/


            $scope.persons = [
                {
                    id: '1',
                    firstName: 'Monica',
                    lastName: 'Smith'
                },
                {
                    id: '2',
                    firstName: 'Sandra',
                    lastName: 'Jackson'
                },
                {
                    id: '3',
                    firstName: 'John',
                    lastName: 'Underwood'
                },
                {
                    id: '4',
                    firstName: 'Chris',
                    lastName: 'Johnatan'
                },
                {
                    id: '5',
                    firstName: 'Kim',
                    lastName: 'Rosowski'
                },
                {
                    id: '6',
                    firstName: 'Kim',
                    lastName: 'Rosowski'
                },
                {
                    id: '7',
                    firstName: 'Kim',
                    lastName: 'Rosowski'
                },
                {
                    id: '8',
                    firstName: 'Kim',
                    lastName: 'Rosowski'
                },
                {
                    id: '9',
                    firstName: 'Kim',
                    lastName: 'Rosowski'
                }
            ];
        }];
});