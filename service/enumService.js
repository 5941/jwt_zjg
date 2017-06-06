define(["angularAMD", "angular", "bootbox"], function (angularAMD, angular, bootbox) {
	// class
	var EnumService = (function () {
		// constructors
		var $rootScope, UtilService, $q;

		function EnumService(rootScope, utilService, q) {
			this.enumList = [];
			this.enums = {};
			this.enumIndex = 0;
			$rootScope = rootScope;
			UtilService = utilService;
			$q = q;
		}

		function EnumAgent(enumInfo) {
			this._info = enumInfo;
			this.isLoaded = false;
			this._enumReady = $q.defer();
			this._enumUsers = [];
		}

		EnumAgent.prototype = {
			searchData: function (v) {
				if (this._info.hash && this._info.arr) {
					if (typeof v === 'string') {
						var value = this._info.hash[v];
						if (value) {
							return {
								"key": v,
								"value": value
							};
						}
					} else if (typeof v === 'number') {
						if (v >= 0 && v < this._info.arr.length) {
							return this._info.arr[v];
						}
					}
				}
			},
			//获取对应名称的整个内容部分
			searchDataContent: function (v) {
				if (this._info.itemHash && this._info.arr) {
					if (typeof v === 'string') {
						return this._info.itemHash[v];
					} else if (typeof v === 'number') {
						if (v >= 0 && v < this._info.arr.length) {
							return this._info.arr[v];
						}
					}
				}
			},
			addEnumUser: function (enumUser) {
				this._enumUsers.push(enumUser);
				if (this._info.arr) {
					enumUser.workEnum(this._info);
				} else {
					//                this.loadData();                
				}
			},
			loadData: function () {
				var self = this;

				if (this._info.url) {
					var url = this._info.url;
					var action = this._info.action || "GET";
					var params = this._info.params || {};
					var onFail = function (data) {
						console.error("load enum error,enum name:" + self._info.name);
						console.error(data);
						console.error(this._info.url);
						self._enumReady.reject(data);
					}
					var onSuccess = function (data) {
						if (data && data.code == 0) {
							//判断后台返回是否有数据，没有则负责
							if (!data.data && !self.isObjectEnum) {
								data.data = [];
							}
							self.setEnumData(data);
							self._enumReady.resolve(self._info);
							self.isLoaded = true;
						}
						else {
							onFail(data);
						}
					}
					UtilService.httpRequest(url, action, params, onSuccess, onFail);
				} else if (this._info.data) {
					self.setEnumData(this._info.data);
					self._enumReady.resolve(self._info);
					self.isLoaded = true;
				}
			},
			setEnumData: function (enumData) {
				var self = this;
				if (this._info.prework) {
					this._info.prework.call(this, enumData);
				}
				if (enumData) {
					if ($.isArray(enumData)) {
						workEnumArray(enumData);
					} else if (typeof enumData === 'object') {
						if (enumData.data) {
							if (enumData.code && enumData.code !== 0) {
								return;
							}
							var trueEnumData = enumData;
							if (self._info.resultName) {
								var _resultNameList = self._info.resultName.split(".");
								for (var i = 0; i < _resultNameList.length; i++) {
									trueEnumData = trueEnumData[_resultNameList[i]];
								}
							} else {
								trueEnumData = enumData.data;
							}

							if ($.isArray(trueEnumData)) {
								workEnumArray(trueEnumData);
							} else if (typeof trueEnumData === 'object') {
								workEnumObject(trueEnumData);
							}
						} else {
							workEnumObject(enumData);
						}
					}
				}

				function workEnumArray(dataArray, enumUser) {
					var arr = [];
					var hash = {};
					var itemHash = {};
					if (dataArray) {
						for (var k = 0; k < dataArray.length; k++) {
							var item = dataArray[k];

							var key = item[self._info.keyName];
							var valueName = self._info.valueName;
							var showValue;
							if (!valueName) {
								showValue = item;
							} else {
								if (typeof valueName === 'string') {
									var valueArr = valueName.split("+");
									if (valueArr.length === 1) {
										showValue = item[self._info.valueName];
									} else {
										showValue = "";
										for (var i = 0; i < valueArr.length; i++) {
											var theValue = item[valueArr[i]];
											if (!theValue) {
												theValue = valueArr[i];
											}
											showValue += theValue;
										}
									}
								} else {
									showValue = item[self._info.valueName];
								}
							}
							item["key"] = key;
							item["value"] = showValue;

							arr.push(item);
							hash[key] = showValue;
							itemHash[key] = item;
						}
					}
					self._info.arr = arr;
					self._info.hash = hash;
					self._info.itemHash = itemHash;

					if (enumUser) {
						enumUser.workEnum(self._info);
					} else {
						for (var i = 0; i < self._enumUsers.length; i++) {
							self._enumUsers[i].workEnum(self._info);
						}
					}
				}

				function workEnumObject(dataObject, enumUser) {
					var arr = [];
					var hash = {};
					var itemHash = {};
					if (dataObject) {
						for (var k in dataObject) {
							var valueName = dataObject[k];
							var key = k;
							var item = {
								"key": key,
								"valueName": valueName
							};
							var showValue;
							if (typeof valueName === 'string') {
								var valueArr = valueName.split("+");
								if (valueArr.length === 1) {
									showValue = valueName;
								} else {
									showValue = "";
									for (var i = 0; i < valueArr.length; i++) {
										var theValue = dataObject[valueArr[i]];
										if (!theValue) {
											theValue = valueArr[i];
										}
										showValue += theValue;
									}
								}
							} else {
								showValue = valueName;
							}
							item["value"] = showValue;

							arr.push(item);
							hash[key] = showValue;
							itemHash[key] = item;
						}
					}
					self._info.arr = arr;
					self._info.hash = hash;
					self._info.itemHash = itemHash;

					if (enumUser) {
						enumUser.workEnum(self._info);
					} else {
						for (var i = 0; i < self._enumUsers.length; i++) {
							self._enumUsers[i].workEnum(self._info);
						}
					}
				}
			}
		}

		EnumService.prototype = {
			addEnum: function (enumInfo) {
				if (!enumInfo) {
					return false;
				}
				var defaultEnumInfo = {
					name: null,
					keyName: "key",
					valueName: "value",
					resultName: null,
					data: null,
					url: null
				};
				if (angular.isArray(enumInfo)) {
					for (var i = 0; i < enumInfo.length; i++) {
						this.addEnum(enumInfo[i]);
					}
				} else {
					angular.extend(defaultEnumInfo, enumInfo);
					if (!defaultEnumInfo.name) {
						defaultEnumInfo.name = "enum" + this.enumIndex;
					}

					var enumAgent = new EnumAgent(defaultEnumInfo);
					enumAgent.loadData();
					this.enums[defaultEnumInfo.name] = enumAgent;
					this.enumList.push(enumAgent);
					this.enumIndex++;

				}
			},
			allEnumReady: function (obj) {
				var deferArr = [];
				var self = this;
				for (var i = 0; i < this.enumList.length; i++) {
					var item = this.enumList[i];
					deferArr.push(item._enumReady.promise);
				}
				if (!obj) {
					return $q.all(deferArr);
				}
				if (typeof obj === 'function') {

					return $q.all(deferArr).then(obj)
				}
				if (typeof obj === 'object' && obj.enumList) {
					deferArr = [];
					for (var i = 0; i < obj.enumList.length; i++) {
						deferArr.push(self.enums[obj.enumList[i]]._enumReady.promise);
					}

					return obj.callback ? $q.all(deferArr, obj.callback) : $q.all(deferArr);
				}
			},
			isAllEnumReady: function () {
				var result = true;
				for (var i = 0; i < this.enumList.length; i++) {
					var item = this.enumList[i];
					if (!item._info.arr || !item._info.hash) {
						result = false;
						break;
					}
				}
				return result;
			}
		};
		// return
		return EnumService;
	})();

	angularAMD.service("EnumService", ["$rootScope", "UtilService", "$q", EnumService]);
});