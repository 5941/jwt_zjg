
define(['jquery', 'angular', 'jsTree', 'ngJsTree','inspinia', 'directive/toggleBtn', 'views/forbid/directive/monthPicker', 'views/forbid/directive/timeRangeSlider'], function () {
	// controller
	return ['$rootScope', '$scope', '$state', 'UtilService', '$timeout', '$compile', 'notify', "$q",
		function ($rootScope, $scope, $state, UtilService, $timeout, $compile, notify, $q) {
			$scope.advSetting = false;
			$scope.tempManualChecked = 0;
			$scope.longManualChecked = 0;
			$scope.time = new Date().format('yyyy-MM-dd') + ' 00:00:00';
			$scope.showEdit = false;
			$scope.params = {
				picName: '',
				startTime: new Date($scope.time),
				endTime: new Date($scope.time),
				isUsable: 'TRUE'
			};

			//获取网申处理方式
			$scope.getNetworkApplication = function () {
				UtilService.httpRequest('jwt_forbid/forbid/configuration/network_application', 'GET', null, function (data) {
					if (data == '') return;
					$scope.tempManualChecked = parseInt(data.data.tempCard.configValue);
					$scope.longManualChecked = parseInt(data.data.longCard.configValue);
				})
			}
			$scope.getNetworkApplication();
			//设置网申处理方式
			$scope.setNetworkApplication = function (value, type) {
				$scope.setValue = { MANUAL: 1, AUTO: 0 };

				if (type == 'long_card')
					$scope.longManualChecked = $scope.setValue[value];
				if (type == 'temp_card')
					$scope.tempManualChecked = $scope.setValue[value];

				UtilService.httpRequest('jwt_forbid/forbid/configuration/' + value + '/' + type, 'PUT', null, function (data) {
					if (data.code == 0) {
						UtilService.toastSuccess('修改成功');
						$scope.getNetworkApplication();
					}
				}, function () {
					UtilService.toastError('修改失败');
					$scope.getNetworkApplication();
				})
			}


			//获取车辆类型和图片
			$scope.getForbidType = function () {
				UtilService.httpRequest('jwt_forbid/forbid/configuration/forbid_type', 'GET', null, function (data) {
					if (data == '') return;
					$scope.forbidType = data.data;
				})
			}
			$scope.getForbidType();
			//设置图片配置
			$scope.setForbidType = function (data) {
				if ($scope.params.picName == '') {
					UtilService.toastError('图片名称不可为空');
					return;
				}

				UtilService.httpRequest('jwt_forbid/forbid/configuration/forbid_pic_type', 'POST', { forbidTypeId: data.forbidTypeId, picTypeName: $scope.params.picName }, function (res) {
					UtilService.toastSuccess('新增成功');
					$scope.getForbidType();

					safeApply($scope, function () {
						$scope.params.picName = '';
						data.showAdd = false;
					});
				})

			}
			//删除图片配置
			$scope.deleteForbidType = function (id, id2) {

				UtilService.confirm('删除配置', '确认删除该图片配置？', function (res) {
					if (!res) return;
					UtilService.httpRequest('jwt_forbid/forbid/configuration/forbid_pic_relation', 'DELETE', { forbidTypeId: id, picTypeId: id2 }, function (data) {
						UtilService.toastSuccess('删除成功');
						$scope.getForbidType();
					});
				})

			}

			//获取早高峰
			$scope.getEarly = function () {
				UtilService.httpRequest('jwt_forbid/forbid/configuration/peak/morning', 'GET', null, function (data) {
					$scope.forbidMonths = [];
					$scope.earlyData = data.data.peak;
					$scope.earlyDataGroup = data.data.peakGroup;
					for (var i in $scope.earlyDataGroup) {
						$scope.forbidMonths = $scope.forbidMonths.concat($scope.earlyDataGroup[i].month.split(','));
					}
					console.log($scope.forbidMonths)

				})
			}
			//获取晚高峰
			$scope.getLate = function () {
				UtilService.httpRequest('jwt_forbid/forbid/configuration/peak/evening', 'GET', null, function (data) {
					$scope.forbidMonth = [];
					$scope.lateData = data.data.peak;
					$scope.lateDataGroup = data.data.peakGroup;
					for (var i in $scope.lateDataGroup) {
						$scope.forbidMonth = $scope.forbidMonth.concat($scope.lateDataGroup[i].month.split(','));
					}
					console.log($scope.forbidMonth)

				})
			}
			$scope.getEarly();
			$scope.getLate();

			$scope.setOpen = function (item) {
				UtilService.httpRequest('jwt_forbid/forbid/configuration/peak/is_usable', 'PUT', { peakGroup: item.peakGroup, isUsable: item.isUsable }, function (data) {

				})
			};

			//打开新增
			$scope.AddEarly = function (type) {
				$scope.Months = [];
				if (type == 'MP') {
					if ($scope.forbidMonths.length == 12) {
						UtilService.toastError('月份已满无法添加');
						return;
					}
					$scope.showAddEarly = true;
					$scope.showAddLate = false;
				} else if (type == 'EP') {
					if ($scope.forbidMonth.length == 12) {
						UtilService.toastError('月份已满无法添加');
						return;
					}
					$scope.showAddLate = true;
					$scope.showAddEarly = false;
				}
				$scope.showEdit = false;
				$scope.params = {
					picName: '',
					dataType: type,
					startTime: new Date($scope.time),
					endTime: new Date($scope.time),
					isUsable: 'TRUE'
				};
			}
			//关闭新增
			$scope.closeEarly = function (type) {
				if (type == 'MP') {
					$scope.getEarly();
					$scope.showAddEarly = false;
				} else if (type == 'EP') {
					$scope.getLate();
					$scope.showAddLate = false;
				}
				$scope.showEdit = false;
				$scope.Months = [];
				$scope.params = {
					picName: '',
					dataType: type,
					startTime: new Date($scope.time),
					endTime: new Date($scope.time),
					isUsable: 'TRUE'
				};
			}
			//打开编辑
			$scope.edit = function (item, type) {
				$scope.Months = [];
				$scope.editData = item;
				item.hide = true;
				$scope.editMonths = [];
				var startTime = new Date().format('yyyy-MM-dd') + ' ' + item.startTime;
				var endTime = new Date().format('yyyy-MM-dd') + ' ' + item.endTime;
				var month = item.month.split(',');
				$scope.editMonths = $scope.editMonths.concat(month);
				$scope.params = {
					picName: '',
					startTime: new Date(startTime),
					endTime: new Date(endTime),
					isUsable: item.isUsable,
					peakGroup: item.peakGroup,
					dataType: type
				};
				if (type == 'MP') {
					$scope.showAddEarly = true;
					$scope.showAddLate = false;
				} else {
					$scope.showAddLate = true;
					$scope.showAddEarly = false;
				}
				$scope.showEdit = true;

			}
			//编辑提交
			$scope.makeEdit = function () {
				$scope.editDatas = {
					"endTime": $scope.params.endTime.format('hh:mm'),
					"isUsable": $scope.params.isUsable,
					"month": $scope.Months.join(),
					"peakGroup": $scope.params.peakGroup,
					"startTime": $scope.params.startTime.format('hh:mm'),
					"peakType": $scope.params.dataType
				}
				UtilService.httpRequest('jwt_forbid/forbid/configuration/peak', 'PUT', $scope.editDatas, function (res) {
					if ($scope.params.dataType == 'MP') {
						$scope.closeEarly('MP');
						$scope.getEarly();
					} else {
						$scope.closeEarly('EP');
						$scope.getLate();
					}
					UtilService.toastSuccess('编辑成功');
				});
			}

			//删除早高峰配置
			$scope.deletEarly = function (id, type) {
				UtilService.confirm('删除高峰配置', '确认删除该配置？', function (res) {
					if (!res) return;
					UtilService.httpRequest('jwt_forbid/forbid/configuration/peak', 'DELETE', { peakGroup: id }, function (data) {
						UtilService.toastSuccess('删除成功');
						if (type == 'MP')
							$scope.getEarly();
						else
							$scope.getLate();
					})
				})
			}


			//新增早高峰配置
			$scope.setEarly = function () {
				$scope.EarlyData = {
					"endTime": $scope.params.endTime.format('hh:mm'),
					"isUsable": $scope.params.isUsable,
					"month": $scope.Months.join(),
					"peakType": $scope.params.dataType,
					"startTime": $scope.params.startTime.format('hh:mm')
				}
				UtilService.httpRequest('jwt_forbid/forbid/configuration/peak', 'POST', $scope.EarlyData, function (res) {
					UtilService.toastSuccess('新增成功');
					if ($scope.params.dataType == 'MP') {
						$scope.getEarly();
						$scope.closeEarly('MP');
					} else {
						$scope.getLate();
						$scope.closeEarly('EP');
					}
				})
			}
			window._scope = $scope;

			$scope.refreshTable = function () {
				$scope.dicMenus[0].dtInstance.reloadData(function () {
				}, true);
			}

			$scope.dicEdit = function (item, id) {
				item.editing = true;
				if (id == "plate_type" || id == "plate_color") {
					item.tempEditData = item.dataValue;
				}
				else if (id == "pass_period") {
					$uibModal.open({
						templateUrl: 'views/modal/edit-pass-period.html',
						size: 'md',
						require: "timeRangeSlider",
						controller: function ($scope, $uibModalInstance) {

							$scope.title = "编辑时段";
							$scope.rangeList = [];
							$scope.tInstance = {};
							$scope.name = item.name;
							var rangeList = item.value.split(";");
							$scope.loaded = $q.defer();
							$uibModalInstance.rendered.then(function () {
								$scope.loaded.promise.then(function () {
									for (var i = 0; i < rangeList.length; i++) {
										$scope.tInstance.createRangeByTime.apply(this, rangeList[i].split("-"));
									}
								});
							});

							$scope.removeRange = function (range) {
								range.remove();
							}


							$scope.ok = function () {
								item.name = $scope.name;
								item.value = $.map($scope.rangeList, function (rangeData) {
									return rangeData.startTime + "-" + rangeData.endTime
								}).join(";");
								var onSuccess = function () {
									UtilService.toastSuccess("保存成功！");
									safeApply($scope, function () {
										$uibModalInstance.close();
									})
								}
								UtilService.httpRequest("jwt_forbid/forbid/configuration/pass_period", "PUT", item, onSuccess);

							};

							$scope.cancel = function () {
								$uibModalInstance.dismiss('cancel');
							};
						}
					});
				}
				else if (id == "forbid_group") {
					item.tempEditData = item.groupName;
				}
			}

			$scope.dicSave = function (item, id, isAdd) {
				var action = isAdd ? "POST" : "PUT";
				var statusName = "enableType";
				var valueName = "dataValue";
				if (id == "plate_type" || id == "plate_color") {
					statusName = "isUsable";
					if (!item[valueName]) {
						UtilService.toastError("字段名称不可为空！");
						return false;
					}

				}
				else if (id == "forbid_group") {
					valueName = "groupName";
					if (!item[valueName]) {
						UtilService.toastError("字段名称不可为空！");
						return false;
					}
				}
				var onSuccess = function () {
					UtilService.toastSuccess("保存成功！");
					$scope.dicMenusMap[id].adding = false;
					$scope.dicMenusMap[id].dtInstance.reloadData(function () { }, true);
				}
				var onFail = function (data) {
					UtilService.toastError("保存失败！");
					$scope.dicMenusMap[id].adding = false;
					$scope.dicMenusMap[id].dtInstance.reloadData(function () { }, true);
				}

				if (!item[statusName]) {
					item[statusName] = "FALSE";
				}

				UtilService.httpRequest($scope.dicMenusMap[id].url, action, item, onSuccess, onFail);
			}

			$scope.dicToggle = function (item, id, isAdd) {
				var statusName = "enableType";
				if (id == "plate_type" || id == "plate_color") {
					statusName = "isUsable";
				}
				var beforeStatus = item[statusName] == "TRUE" ? "FALSE" : "TRUE";
				var onSuccess = function () {
					UtilService.toastSuccess("保存成功！");
				}
				var onFail = function (data) {
					safeApply($scope, function () {
						item[statusName] = beforeStatus;
					})
					UtilService.toastError("保存失败！");
				}
				if (isAdd) {

				}
				else {
					UtilService.httpRequest($scope.dicMenusMap[id].url, "PUT", item, onSuccess, onFail);
				}
			}

			$scope.dicCancel = function (item, id, isAdd) {
				if (id == "plate_type" || id == "plate_color") {
					item.dataValue = item.tempEditData;
				}
				else if (id == "forbid_group") {
					item.groupName = item.tempEditData;
				}
				item.editing = false;
				$scope.dicMenusMap[id].adding = false;
			}

			$scope.dicAdd = function (item) {

				if (item.id == "plate_color") {
					item.adding = true;
					$scope.plateColorList[0].editing = true;
				}
				else if (item.id == "plate_type") {
					item.adding = true;
					$scope.plateTypeList[0].editing = true;
				}
				else if (item.id == "forbid_group") {
					item.adding = true;
					$scope.forbidGroupList[0].editing = true;
				}
				else if (item.id == "pass_period") {
					$uibModal.open({
						templateUrl: 'views/modal/edit-pass-period.html',
						size: 'md',
						require: "timeRangeSlider",
						controller: function ($scope, $uibModalInstance) {

							$scope.title = "新增时段";
							$scope.rangeList = [];
							$scope.tInstance = {};
							$scope.name = item.name;

							$scope.loaded = $q.defer();

							$scope.removeRange = function (range) {
								range.remove();
							}

							$scope.ok = function () {
								item.name = $scope.name;
								item.value = $.map($scope.rangeList, function (rangeData) {
									return rangeData.startTime + "-" + rangeData.endTime
								}).join(";");
								var onSuccess = function () {
									UtilService.toastSuccess("保存成功！");
									safeApply($scope, function () {
										$uibModalInstance.close();
									})
								}
								UtilService.httpRequest("jwt_forbid/forbid/configuration/pass_period", "PUT", item, onSuccess);

							};

							$scope.cancel = function () {
								$uibModalInstance.dismiss('cancel');
							};
						}
					});
				}
			}

			$scope.dicMenusList = [
				{
					"id": "plate_type",
					"name": "号牌种类",
					"url": "jwt_forbid/forbid/configuration/plate_type",
					"keyName": "dataKey",
					"valueName": "dataValue",
					"enableName": "isUsable",
					"dtInstance": {},
					"dtOptions": {
						"processing": true,
						"serverSide": true,
						"order": [],
						"autoWidth": true,
						"createdRow": function (row, data, dataIndex) {
							$('td', row).attr("ng-class", "{table_select_bg:selectedRows[" + data.dataKey + "]}");
							if (!data.dataKey) { $(row).attr("ng-show", "dicMenusMap['plate_type'].adding"); }
							$compile(angular.element(row))($scope);
						},
						"ajax": function (source, callback, settings) {

							var onSuccess = function (data) {
								var result = data.data.datas;

								if (result) {
									result.unshift({
										editing: true
									});
								}
								else {
									result = [{
										editing: true
									}]
								}

								result.recordsTotal = data.data.totalRecords;
								result.recordsFiltered = data.data.totalRecords;
								$scope.plateTypeList = result;
								callback(result);
							};

							UtilService.httpRequest('jwt_forbid/forbid/configuration/plate_type', 'GET',
								{
									pageNumber: source.start / source.length + 1,
									pageSize: source.length

								}, onSuccess);
						},
						"headerCallback": function (header) {
							$compile(angular.element(header).contents())($scope);
						},
						// "rowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
						// 	$('td:not(:first-child):not(:last-child)', nRow).unbind('click');


						// 	return nRow;
						// }
					},
					"dtColumns": [{
						bSortable: false,
						mData: null,
						sClass: 'select-checkbox',
						sTitle: '<input type="checkbox" ng-click="dicToggleAll(dicMenusMap[\'plate_type\'])" ng-model="dicMenusMap[\'plate_type\'].allSelected"/>',
						mRender: function (data, type, full, meta) {
							return '<input type="checkbox"  ng-model="plateTypeList[' + meta.row + '].checked"/>';
						}
					},
					{
						bSortable: false,
						mData: null,
						sTitle: '字段名称',
						mRender: function (data, type, full, meta) {
							return "<span ng-hide='plateTypeList[" + meta.row + "].editing' ng-bind='plateTypeList[" + meta.row + "].dataValue'> </span>" +
								"<input ng-show='plateTypeList[" + meta.row + "].editing' ng-model='plateTypeList[" + meta.row + "].dataValue'>"
						}
					},
					{
						bSortable: false,
						mData: null,
						sTitle: '启用状态',
						sClass: "usable-col",
						mRender: function (data, type, full, meta) {
							if (data.dataKey) {
								return "<toggle-btn ng-model='plateTypeList[" + meta.row + "].isUsable' ng-click='dicToggle(plateTypeList[" + meta.row + "],\"plate_type\")' />"

							}
							else {
								return "<toggle-btn ng-model='plateTypeList[" + meta.row + "].isUsable' ng-click='dicToggle(plateTypeList[" + meta.row + "],\"plate_type\",true)' />"
							}
						}
					},

					{
						bSortable: false,
						mData: null,
						sTitle: '操作',
						sClass: "operator-col",
						mRender: function (data, type, full, meta) {
							if (data.dataKey) {
								return "<span class='edit-button' ng-click='dicEdit(plateTypeList[" + meta.row + "],\"plate_type\")' ng-hide='plateTypeList[" + meta.row + "].editing'>编辑</span>" +
									"<span class='edit-button' ng-click='dicSave(plateTypeList[" + meta.row + "],\"plate_type\")' ng-show='plateTypeList[" + meta.row + "].editing'>保存</span>" +
									"<span class='edit-button' ng-click='dicCancel(plateTypeList[" + meta.row + "],\"plate_type\")' ng-show='plateTypeList[" + meta.row + "].editing' style='margin-left:18px;' >取消</span>"

							}
							else {
								return "<span class='edit-button' ng-click='dicEdit(plateTypeList[" + meta.row + "],\"plate_type\",true)' ng-hide='plateTypeList[" + meta.row + "].editing'>编辑</span>" +
									"<span class='edit-button' ng-click='dicSave(plateTypeList[" + meta.row + "],\"plate_type\",true)' ng-show='plateTypeList[" + meta.row + "].editing'>保存</span>" +
									"<span class='edit-button' ng-click='dicCancel(plateTypeList[" + meta.row + "],\"plate_type\",true)' ng-show='plateTypeList[" + meta.row + "].editing' style='margin-left:18px;' >取消</span>"

							}

						}
					}]
				},
				{
					"id": "plate_color",
					"name": "号牌颜色",
					"url": "jwt_forbid/forbid/configuration/plate_color",
					"keyName": "dataKey",
					"valueName": "dataValue",
					"enableName": "isUsable",
					"dtInstance": {},
					"dtOptions": {
						"processing": true,
						"serverSide": true,
						"order": [],
						"autoWidth": true,
						"createdRow": function (row, data, dataIndex) {
							$('td', row).attr("ng-class", "{table_select_bg:selectedRows[" + data.testAlcoholId + "]}");
							if (!data.dataKey) { $(row).attr("ng-show", "dicMenusMap['plate_color'].adding"); }
							$compile(angular.element(row))($scope);
						},
						"ajax": function (source, callback, settings) {
							var onSuccess = function (data) {
								var result = data.data.datas;

								if (result) {
									result.unshift({
										editing: true
									});
								}
								else {
									result = [{
										editing: true
									}]
								}

								result.recordsTotal = data.data.totalRecords;
								result.recordsFiltered = data.data.totalRecords;

								$scope.plateColorList = result;
								callback(result);
							};

							UtilService.httpRequest('jwt_forbid/forbid/configuration/plate_color', 'GET',
								{
									pageNumber: source.start / source.length + 1,
									pageSize: source.length

								}, onSuccess);
						},
						"headerCallback": function (header) {
							$compile(angular.element(header).contents())($scope);
						},
						// "rowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
						// 	$('td:not(:first-child):not(:last-child)', nRow).unbind('click');


						// 	return nRow;
						// }
					},
					"dtColumns": [
						{
							bSortable: false,
							mData: null,
							sClass: 'select-checkbox',
							sTitle: '<input type="checkbox" ng-click="dicToggleAll(dicMenusMap[\'plate_color\'])" ng-model="dicMenusMap[\'plate_color\'].allSelected"/>',
							mRender: function (data, type, full, meta) {
								return '<input type="checkbox"  ng-model="plateColorList[' + meta.row + '].checked"/>';
							}
						},
						{
							bSortable: false,
							mData: null,
							sTitle: '字段名称',
							mRender: function (data, type, full, meta) {
								return "<span ng-hide='plateColorList[" + meta.row + "].editing' ng-bind='plateColorList[" + meta.row + "].dataValue'> </span>" +
									"<input ng-show='plateColorList[" + meta.row + "].editing' ng-model='plateColorList[" + meta.row + "].dataValue'>"
							}
						},
						{
							bSortable: false,
							mData: null,
							sTitle: '启用状态',
							sClass: "usable-col",
							mRender: function (data, type, full, meta) {
								if (data.dataKey) {
									return "<toggle-btn ng-model='plateColorList[" + meta.row + "].isUsable' ng-click='dicToggle(plateColorList[" + meta.row + "],\"plate_color\")' />"

								}
								else {
									return "<toggle-btn ng-model='plateColorList[" + meta.row + "].isUsable' ng-click='dicToggle(plateColorList[" + meta.row + "],\"plate_color\",true)' />"

								}
							}
						},

						{
							bSortable: false,
							mData: null,
							sTitle: '操作',
							sClass: "operator-col",
							mRender: function (data, type, full, meta) {
								if (data.dataKey) {
									return "<span class='edit-button' ng-click='dicEdit(plateColorList[" + meta.row + "],\"plate_color\")' ng-hide='plateColorList[" + meta.row + "].editing'>编辑</span>" +
										"<span class='edit-button' ng-click='dicSave(plateColorList[" + meta.row + "],\"plate_color\")' ng-show='plateColorList[" + meta.row + "].editing'>保存</span>" +
										"<span class='edit-button' ng-click='dicCancel(plateColorList[" + meta.row + "],\"plate_color\")' ng-show='plateColorList[" + meta.row + "].editing' style='margin-left:18px;' >取消</span>"
								}
								else {
									return "<span class='edit-button' ng-click='dicEdit(plateColorList[" + meta.row + "],\"plate_color\",true)' ng-hide='plateColorList[" + meta.row + "].editing'>编辑</span>" +
										"<span class='edit-button' ng-click='dicSave(plateColorList[" + meta.row + "],\"plate_color\",true)' ng-show='plateColorList[" + meta.row + "].editing'>保存</span>" +
										"<span class='edit-button' ng-click='dicCancel(plateColorList[" + meta.row + "],\"plate_color\",true)' ng-show='plateColorList[" + meta.row + "].editing' style='margin-left:18px;' >取消</span>"

								}
							}
						}]
				},
				{
					"id": "pass_period",
					"name": "常用通行时段",
					"keyName": "passPeriodId",
					"valueName": "name",
					"enableName": "enableType",
					"url": "jwt_forbid/forbid/configuration/pass_period",
					"dtInstance": {},
					"dtOptions": {
						"processing": true,
						"serverSide": true,
						"order": [],
						"autoWidth": true,
						"createdRow": function (row, data, dataIndex) {
							$('td', row).attr("ng-class", "{table_select_bg:selectedRows[" + data.testAlcoholId + "]}");
							$compile(angular.element(row).contents())($scope);
						},
						"ajax": function (source, callback, settings) {
							var onSuccess = function (data) {
								var result = data.data.datas;

								result.recordsTotal = data.data.totalRecords;
								result.recordsFiltered = data.data.totalRecords;

								$scope.passPeriodList = result;
								callback(result);
							};

							UtilService.httpRequest('jwt_forbid/forbid/configuration/pass_period', 'GET',
								{
									pageNumber: source.start / source.length + 1,
									pageSize: source.length

								}, onSuccess);
						},
						"headerCallback": function (header) {
							$compile(angular.element(header).contents())($scope);
						},
						// "rowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
						// 	$('td:not(:first-child):not(:last-child)', nRow).unbind('click');


						// 	return nRow;
						// }
					},
					"dtColumns": [
						{
							bSortable: false,
							mData: null,
							sClass: 'select-checkbox',
							sTitle: '<input type="checkbox" ng-click="dicToggleAll(dicMenusMap[\'pass_period\'])" ng-model="dicMenusMap[\'pass_period\'].allSelected"/>',
							mRender: function (data, type, full, meta) {
								return '<input type="checkbox" ng-model="passPeriodList[' + meta.row + '].checked"/>';
							}
						},
						{
							bSortable: false,
							mData: null,
							sTitle: '字段名称',
							mRender: function (data, type, full, meta) {
								return "<span  ng-bind='passPeriodList[" + meta.row + "].name'> </span>";
							}
						},
						{
							bSortable: false,
							mData: null,
							sTitle: '对应时段',
							mRender: function (data, type, full, meta) {
								return "<span  ng-bind='passPeriodList[" + meta.row + "].value'> </span>";
							}
						},
						{
							bSortable: false,
							mData: null,
							sTitle: '启用状态',
							sClass: "usable-col",
							mRender: function (data, type, full, meta) {
								if (data.passPeriodId) {
									return "<toggle-btn ng-model='passPeriodList[" + meta.row + "].enableType' ng-click='dicToggle(passPeriodList[" + meta.row + "],\"pass_period\")' />"
								}
								else {
									return "<toggle-btn ng-model='passPeriodList[" + meta.row + "].enableType' ng-click='dicToggle(passPeriodList[" + meta.row + "],\"pass_period\",true)' />"
								}
							}
						},

						{
							bSortable: false,
							mData: null,
							sTitle: '操作',
							sClass: "operator-col",
							mRender: function (data, type, full, meta) {

								return "<span class='edit-button' ng-click='dicEdit(passPeriodList[" + meta.row + "],\"pass_period\")' >编辑</span>"

							}
						}]
				},
				{
					"id": "forbid_group",
					"name": "禁行区域组",
					"url": "jwt_forbid/forbid/configuration/forbid_group",
					"dtInstance": {},
					"keyName": "forbidGroupId",
					"valueName": "groupName",
					"enableName": "enableType",
					"dtOptions": {
						"processing": true,
						"serverSide": true,
						"order": [],
						"autoWidth": true,
						"createdRow": function (row, data, dataIndex) {
							$('td', row).attr("ng-class", "{table_select_bg:selectedRows[" + data.testAlcoholId + "]}");
							if (!data.forbidGroupId) { $(row).attr("ng-show", "dicMenusMap['forbid_group'].adding"); }
							$compile(angular.element(row))($scope);
						},
						"ajax": function (source, callback, settings) {
							var onSuccess = function (data) {
								var result = data.data.datas;
								if (result) {
									result.unshift({
										editing: true
									});
								}
								else {
									result = [{
										editing: true
									}]
								}
								result.recordsTotal = data.data.totalRecords;
								result.recordsFiltered = data.data.totalRecords;

								$scope.forbidGroupList = result;
								callback(result);
							};

							UtilService.httpRequest('jwt_forbid/forbid/configuration/forbid_group', 'GET',
								{
									pageNumber: source.start / source.length + 1,
									pageSize: source.length

								}, onSuccess);
						},
						"headerCallback": function (header) {
							$compile(angular.element(header).contents())($scope);
						},
						// "rowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
						// 	$('td:not(:first-child):not(:last-child)', nRow).unbind('click');


						// 	return nRow;
						// }
					},
					"dtColumns": [
						{
							bSortable: false,
							mData: null,
							sClass: 'select-checkbox',
							sTitle: '<input type="checkbox" ng-click="dicToggleAll(dicMenusMap[\'forbid_group\'])" ng-model="dicMenusMap[\'forbid_group\'].allSelected"/>',
							mRender: function (data, type, full, meta) {
								return '<input type="checkbox"  ng-model="forbidGroupList[' + meta.row + '].checked"/>';
							}
						},
						{
							bSortable: false,
							mData: null,
							sTitle: '字段名称',
							mRender: function (data, type, full, meta) {
								return "<span ng-hide='forbidGroupList[" + meta.row + "].editing' ng-bind='forbidGroupList[" + meta.row + "].groupName'> </span>" +
									"<input ng-show='forbidGroupList[" + meta.row + "].editing' ng-model='forbidGroupList[" + meta.row + "].groupName'>"
							}
						},
						{
							bSortable: false,
							mData: null,
							sTitle: '对应区域',
							"sDefaultContent": "",
							mRender: function (data, type, full, meta) {
								var areaList = $.map(data.forbidArea, function (item) {
									return item.areaName
								});
								return areaList.join("、");
							}
						},
						{
							bSortable: false,
							mData: null,
							sTitle: '启用状态',
							sClass: "usable-col",
							mRender: function (data, type, full, meta) {
								if (data.forbidGroupId) {
									return "<toggle-btn ng-model='forbidGroupList[" + meta.row + "].isUsable' ng-click='dicToggle(forbidGroupList[" + meta.row + "],\"forbid_group\")' />"

								}
								else {
									return "<toggle-btn ng-model='forbidGroupList[" + meta.row + "].isUsable' ng-click='dicToggle(forbidGroupList[" + meta.row + "],\"forbid_group\",true)' />"
								}
							}
						},

						{
							bSortable: false,
							mData: null,
							sTitle: '操作',
							sClass: "operator-col",
							mRender: function (data, type, full, meta) {
								if (data.forbidGroupId) {
									return "<span class='edit-button' ng-click='dicEdit(forbidGroupList[" + meta.row + "],\"forbid_group\")' ng-hide='forbidGroupList[" + meta.row + "].editing'>编辑</span>" +
										"<span class='edit-button' ng-click='dicSave(forbidGroupList[" + meta.row + "],\"forbid_group\")' ng-show='forbidGroupList[" + meta.row + "].editing'>保存</span>" +
										"<span class='edit-button' ng-click='dicCancel(forbidGroupList[" + meta.row + "],\"forbid_group\")' ng-show='forbidGroupList[" + meta.row + "].editing' style='margin-left:18px;' >取消</span>"
								}
								else {
									return "<span class='edit-button' ng-click='dicEdit(forbidGroupList[" + meta.row + "],\"forbid_group\",true)' ng-hide='forbidGroupList[" + meta.row + "].editing'>编辑</span>" +
										"<span class='edit-button' ng-click='dicSave(forbidGroupList[" + meta.row + "],\"forbid_group\",true)' ng-show='forbidGroupList[" + meta.row + "].editing'>保存</span>" +
										"<span class='edit-button' ng-click='dicCancel(forbidGroupList[" + meta.row + "],\"forbid_group\",true)' ng-show='forbidGroupList[" + meta.row + "].editing' style='margin-left:18px;' >取消</span>"

								}
							}
						}]
				}
			];
			$scope.dicMenusMap = {};
			for (var i = 0; i < $scope.dicMenusList.length; i++) {
				$scope.dicMenusMap[$scope.dicMenusList[i].id] = $scope.dicMenusList[i];
			}

			$scope.getItemList = function (item) {
				var id;
				if (typeof item == "string") {
					id = item;
				}
				else {
					id = item.id;
				}
				if (id == "plate_type") {
					return $scope.plateTypeList || [];
				}
				else if (id == "plate_color") {
					return $scope.plateColorList || [];
				}
				else if (id == "pass_period") {
					return $scope.passPeriodList || [];
				}
				else if (id == "forbid_group") {
					return $scope.forbidGroupList || [];
				}

			}
			$scope.dicToggleAll = function (item) {
				var list = $scope.getItemList(item);

				for (var i = 0; i < list.length; i++) {
					list[i].checked = item.allSelected;
				}

			}
			$scope.selectedCount = function (item) {
				var list = $scope.getItemList(item);
				var count = 0;
				for (var i = 0; i < list.length; i++) {
					if (list[i].checked) {
						count++;
					}
				}
				return count;
			}
			$scope.enableRows = function (item) {
				var list = $scope.getItemList(item);
				var idList = [];
				for (var i = 0; i < list.length; i++) {
					if (list[i][item.keyName] && list[i].checked) {
						idList.push(list[i][item.keyName]);
					}
				}
				var url = item.url + "/is_usable";
				var params = {};
				params[item.keyName] = idList;
				params[item.enableName] = "TRUE";
				var onSuccess = function () {
					UtilService.toastSuccess("保存成功");
				}
				if (idList.length > 0) {
					UtilService.httpRequest(url, "PUT", params, onSuccess);
				}
			}
			$scope.disableRows = function (item) {
				var list = $scope.getItemList(item);
				var idList = [];
				for (var i = 0; i < list.length; i++) {
					if (list[i][item.keyName] && list[i].checked) {
						idList.push(list[i][item.keyName]);
					}
				}
				var url = item.url + "/is_usable";
				var params = {};
				params[item.keyName] = idList;
				params[item.enableName] = "FALSE";
				var onSuccess = function () {
					UtilService.toastSuccess("保存成功");
				}
				if (idList.length > 0) {
					UtilService.httpRequest(url, "PUT", params, onSuccess);
				}
			}

			$scope.currentDicTab = $scope.dicMenusList[2];
			$scope.setCurrentDicTab = function (item) {
				$scope.currentDicTab = item;
			}

		}];
});