define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("deptpersontree", ["$q", "UtilService", "$timeout", function ($q, UtilService, $timeout) {
        return {
            restrict: 'AE',
            scope: { onSelect: '&', data: '=', instance: "=", onLoaded: '&?', personList: "=", totalPersonMap: "=", totalPersonList: "=", totalPersonListReady: "=" },
            templateUrl: 'views/modal/deptPersonTree.html',
            controller: function ($scope, $element) {
                $scope.depts = [];
                $scope.moduleCode = $scope.moduleCode ? $scope.moduleCode : "attend_duty";
                //配置树
                $scope.account = JSON.parse(localStorage.getItem("account"));

                $scope.treeConfig = {
                    core: {
                        multiple: true,
                        animation: true,
                        error: function (error) {
                            $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                        },
                        check_callback: false,
                        worker: true,
                        themes: {
                            dots: false
                        }
                    },
                    version: 1,
                    'plugins': ['types', 'search', 'checkbox'],
                    'search': {
                        show_only_matches: true,
                        show_only_matches_children: true
                    },
                    'types': {
                        'default': {
                            'icon': 'fa fa-folder'
                        }
                    },
                    'checkbox': {
                        keep_selected_style: false,
                        three_state: false,
                        tie_selection: false,
                        cascade: "up+down"
                    }
                };

                /**
                 * 获取本部门所有人员列表
                 */
                var getTotalPersonList = function () {
                    var url = "/framework_common/person";
                    var method = "GET";
                    var params = {
                        pageNumber: 1,
                        pageSize: 0,
                        deptId: $scope.account.deptId,
                        subDept: true
                    };
                    var onFail = function (data) {
                        UtilService.alert(data.message || "获取部门所有人员失败！");
                    }
                    var onSuccess = function (data) {
                        if (data.code === 0 && data.data) {
                            $scope.totalPersonList = data.data.datas;
                            for (var i = 0; i < $scope.totalPersonList.length; i++) {
                                var item = $scope.totalPersonList[i];
                                $scope.totalPersonMap[item.personId] = item;
                            }
                            $timeout(function () {
                                $scope.totalPersonListReady.resolve();
                            });
                        }
                        else {
                            onFail(data);
                        }
                    }
                    UtilService.httpRequest(url, method, params, onSuccess, onFail);
                }

                getTotalPersonList();


                /**
                * 获取子部门所有人员列表
                */
                $scope.getSubPersonList = function (id, callback) {

                    var url = "/framework_common/person";
                    var method = "GET";
                    var params = {
                        pageNumber: 1,
                        pageSize: 0,
                        deptId: id,
                        subDept: true
                    };
                    var onFail = function (data) {
                        UtilService.alert(data.message);
                    }
                    var onSuccess = function (data) {
                        if (data.code === 0 && data.data) {
                            safeApply($scope, function () {
                                callback(data.data.datas);
                            })
                        }
                        else {
                            onFail(data);
                        }
                    }
                    UtilService.httpRequest(url, method, params, onSuccess, onFail);
                }

                // $scope.treeData = [];
                //监听选择树节点事件
                $scope.select_node = function (event, obj) {

                    var originalData = obj.node.original;
                    /**
                     * 选择的回调
                     * @param {object} data 
                     */
                    var callback = function (data) {
                        if (!data) {
                            return false;
                        }

                        for (var i = 0; i < data.length; i++) {
                            $scope.totalPersonMap[data[i].personId].checked = true;
                        }

                    }
                    //如果是部门的话，需要调接口，获取部门下的所有人员，将其选中;
                    if (originalData.dataType === "dept") {
                        $scope.getSubPersonList(originalData.id, callback);
                    }
                    else {
                        safeApply($scope, function () {
                            $scope.totalPersonMap[originalData.id].checked = true;
                        })
                    }
                };

                $scope.deselect_node = function (event, obj) {

                    var originalData = obj.node.original;
                    /**
                     * 选择的回调
                     * @param {object} data 
                     */
                    var callback = function (data) {
                        if (!data) {
                            return false;
                        }

                        for (var i = 0; i < data.length; i++) {
                            $scope.totalPersonMap[data[i].personId].checked = false;
                        }
                    }
                    //如果是部门的话，需要调接口，获取部门下的所有人员，将其添加到列表中;
                    if (originalData.dataType === "dept") {
                        $scope.getSubPersonList(originalData.id, callback);
                    }
                    else {

                        safeApply($scope, function () {
                            $scope.totalPersonMap[originalData.id].checked = false;
                        });

                    }
                }

                $scope.treeData = function (obj, callback) {
                    // 有可能在angular的digest里调用，这时候没有参数，所以都得返回
                    if (!callback) {
                        return false;
                    }

                    var parent = obj.id;
                    // callback.call(this, []);
                    var onSuccess = function (data) {
                        var depts = data.data.depts;
                        var persons = data.data.persons;
                        var treeData = [];
                        var shouldParantCheck = true;

                        for (var i in depts) {
                            treeData.push({
                                "id": depts[i].deptId,
                                "parent": parent,
                                "dataType": "dept",
                                "text": depts[i].deptName,
                                "state": {
                                    "opened": false
                                },
                                "children": true
                            });

                        }

                        for (var i in persons) {
                            if ($scope.totalPersonMap[persons[i].personId].checked !== true) {
                                shouldParantCheck = false;
                            }
                            treeData.push({
                                "id": persons[i].personId,
                                "parent": parent,
                                "dataType": "person",
                                "text": persons[i].personName,
                                "state": {
                                    "opened": false,
                                    "selected": $scope.totalPersonMap[persons[i].personId].checked == true
                                }
                            });

                        }

                        obj.state.selected = shouldParantCheck;
                        if (!shouldParantCheck) {

                            for (var j in obj.parents) {
                                $scope.treeInstance.jstree().get_node(obj.parents[j]).state.selected = false;
                            }
                            $scope.treeInstance.jstree().redraw(true);
                        }

                        // $scope.treeConfig.version++;
                        callback.call(this, treeData);

                        // $scope.treeData = treeData;
                    };
                    var params = {
                        pageNumber: 1, pageSize: 0, moduleCode: $scope.moduleCode,
                        deptId: parent === "#" ? null : parent
                    }
                    $scope.totalPersonListReady.then(function () {
                        UtilService.httpRequest('framework_common/permission/dept_person_by_data_rule', 'GET', params, onSuccess);
                    })
                }



                $scope.loaded = function (event, obj) {

                    $scope.instance = $scope.treeInstance;
                    // if ($scope.depts.length > 0) {
                    //     $scope.treeInstance.jstree().select_node($scope.depts[0].deptId);
                    // }
                };

                //树的查询
                var to = false;
                $scope.searchTree = function () {
                    if (to) {
                        clearTimeout(to);
                    }
                    to = setTimeout(function () {
                        if ($scope.keyword == undefined) return;

                        $scope.treeInstance.jstree().search($scope.keyword);
                    }, 300);
                };
            }
        };
    }]);
});