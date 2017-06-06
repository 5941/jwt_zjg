define(["angularAMD", "angular","bootbox"], function (angularAMD, angular,bootbox) {
    // class
    var UtilService = (function () {

        // constructors
        function UtilService($rootScope,$uibModal,notify,cfpLoadingBar,$http) {
            
            self.$rootScope = $rootScope;
            self.$uibModal = $uibModal;
            self.notify = notify;
            self.cfpLoadingBar = cfpLoadingBar;

            $rootScope.statusMap = {'TRUE':'启用','FALSE':'禁用'};
            $rootScope.yesNoMap = {'TRUE':'是','FALSE':'否'};

            $rootScope.goBack = function(){
                history.back();
            }
        }

        // methods
        UtilService.prototype.alert = function (message,callback) {
            var _callback = function(){if(callback)callback();}
            bootbox.alert({"message":message,size: "small",callback:_callback});
        }

        UtilService.prototype.confirm = function(title,message,callback){
            var _callback = function(result){callback(result);}
            var buttons= {
                    cancel: {label: '取消',className: 'btn-default'},
                    confirm: {label: '确认',className: 'btn-success'},
                };

             bootbox.confirm({title:title,message:message,size: "small",callback:_callback,buttons:buttons});
        }

        UtilService.prototype.toastSuccess = function (message) {
            notify.config({duration:1500,startTop:200});
            notify({ message: message, classes: 'alert-success',templateUrl:'views/common/notify.html'});
        }

        UtilService.prototype.toastError = function (message) {
            notify.config({duration:1500,startTop:200});
            notify({ message: message, classes: 'alert-danger',templateUrl:'views/common/notify.html'});
        }

        UtilService.prototype.goBack = function (index) {
            if (!index) {
                index = -1;
            }

            $ionicHistory.$ionicGoBack(index);
        }

        UtilService.prototype.checkRequired = function (data) {
            for (var i in data) {
                if (data[i][0] == undefined || data[i][0] == '' || (typeof data[i][0] == undefined)) {
                    UtilService.prototype.alert(data[i][1]);
                    return false;
                }
            }
            return true;
        }

        UtilService.prototype.baseApiUrl = function(){
            return baseApiUrl;
        }

        UtilService.prototype.UrlSearch = function(key){
            var name, value;
            var str = location.href; //取得整个地址栏
            var num = str.indexOf("?");
            str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

            var arr = str.split("&"); //各个参数放到数组里
            for (var i = 0; i < arr.length; i++) {
                num = arr[i].indexOf("=");
                if (num > 0) {
                    name = arr[i].substring(0, num);
                    value = arr[i].substr(num + 1);
                    this[name] = value;
                }
            }
        }

        UtilService.prototype.httpRequest = function (url, action, params, onSuccess, onFailed, onError) {
            var Request = new UtilService.prototype.UrlSearch();
            if(Request.token != null && window.localStorage.getItem("accessToken") != Request.token){
                window.localStorage.setItem("accessToken",Request.token);
            }
            //$ionicLoading.show({ template: 'Loading...' });
            if (action.toUpperCase() != 'GET') params = JSON.stringify(params);
            // console.log(params);
            var myUrl = url;
            if(url.indexOf('http://')!=0)myUrl = baseApiUrl + url;
            
            self.cfpLoadingBar.start();
            $.ajax({
                url: myUrl,
                data: params,
                type: action,
                cache: false,
                dataType: 'json',
                traditional:true,
                beforeSend: function (request) {
                    request.setRequestHeader("X-Token", window.localStorage.getItem("accessToken"));
                },
                contentType: "application/json;charset=UTF-8",
                success: function (data) {
                    cfpLoadingBar.complete();
                    if (data.code == 0) {
                        if (typeof (onSuccess) != "undefined") onSuccess(data);
                    } else {
                        if (typeof (onFailed) == "undefined") {
                            UtilService.prototype.alert(data.message);
                        } else {
                            onFailed(data);
                        }
                    }
                },
                error: function (obj, message) {
                    //$ionicLoading.hide();
                    cfpLoadingBar.complete();
                    console.log(onFailed);
                    if (typeof (onError) != "undefined") {
                        onError({ code: '-1', message: message });
                    } else if (typeof (onFailed) != "undefined") {
                        onFailed({ code: '-1', message: message });
                    } else {
                        UtilService.prototype.toastError('系统连接异常');
                    }
                }
            });
        };

        UtilService.prototype.httpRequestSync = function (url, action, params, onSuccess, onFailed, onError) {

            if (action.toUpperCase() != 'GET') params = JSON.stringify(params);

            $.ajax({
                url: baseApiUrl + url,
                data: params,
                type: action,
                cache: false,
                dataType: 'json',
                async:false,
                beforeSend: function (request) {
                    request.setRequestHeader("X-Token", window.localStorage.getItem("accessToken"));
                },
                contentType: "application/json;charset=UTF-8",
                success: function (data) {
                    //$ionicLoading.hide();

                    if (data.code == 0) {
                        if (typeof (onSuccess) != "undefined") onSuccess(data);
                    } else {
                        if (typeof (onFailed) == "undefined") {
                            UtilService.prototype.alert(data.message);
                        } else {
                            onFailed(data);
                        }
                    }
                },
                error: function (obj, message) {
                    //$ionicLoading.hide();
                    console.log(onFailed);
                    if (typeof (onError) != "undefined") {
                        onError({ code: '-1', message: message });
                    } else if (typeof (onFailed) != "undefined") {
                        onFailed({ code: '-1', message: message });
                    } else {
                        UtilService.prototype.alert('系统连接异常');
                    }
                }
            });
        };

        UtilService.prototype.currentPosition = function(){
            return {lat:100,lon:100,address:"智通科技"};
        }

        UtilService.prototype.download = function(url,params){
            console.log(params);
            var data='';
            for(var i in params){
                if(params[i]!='' && params[i]!= null){
                    data=data+i+'='+params[i]+'&'
                }
            }
            data=data.substring(0,data.length-1);
            
            if(url.indexOf('?')>0)
                window.open(baseApiUrl + url+''+data);
            else
                window.open(baseApiUrl + url+'?'+data);

        }

        UtilService.prototype.rangedate_locale = {   
                                applyLabel : '确定',  
                                cancelLabel : '取消',  
                                fromLabel : '起始时间',  
                                toLabel : '结束时间',  
                                customRangeLabel : '自定义',  
                                daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],  
                                monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',  
                                            '七月', '八月', '九月', '十月', '十一月', '十二月' ],  
                                firstDay : 1 
                            }  ;

        UtilService.prototype.openColumnDef = function(dtColumns){
            $uibModal.open({
                templateUrl: 'views/modal/column-define.html',
                size:'lg',
                controller: function($scope, $uibModalInstance) {
                    $scope.dtColumns = dtColumns;
                    for(var i in $scope.dtColumns){
                        if($scope.dtColumns[i].bCanHidden==undefined || $scope.dtColumns[i].bCanHidden==true){
                            $scope.dtColumns[i].bCanHidden=true;
                        }
                        
                        if($scope.dtColumns[i].bVisible==undefined || $scope.dtColumns[i].bVisible==true){
                            $scope.dtColumns[i].bVisible=true;
                        }
                    }

                    $scope.ok = function () {
                        $uibModalInstance.close();
                        var names = document.getElementsByName("checkbox"); 
                        for(var i=0; i<names.length; i++){
                            if(names[i].checked){
                                $scope.dtColumns[i].bVisible=true;
                            }else{
                                $scope.dtColumns[i].bVisible=false;
                            }
                        }
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            });
        }

        UtilService.prototype.getDefaultTreeConfig = function(){
            var config = {
                core: {
                    multiple: false,
                    animation: true,
                    error: function (error) {
                        $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                    },
                    check_callback: true,
                    worker: true,
                    themes:{
                        dots:false
                    }
                },
                version : 1,
                'plugins': ['types', 'search'],
                'search': {
                    show_only_matches: true,
                    show_only_matches_children: true
                },
                'types': {
                    'default': {
                        'icon': 'fa fa-folder'
                    }
                }
            };
            return config;
        }

        UtilService.prototype.getEditableTreeConfig = function(){
            var config = {
                core: {
                    multiple: true,
                    animation: true,
                    error: function (error) {
                        $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                    },
                    check_callback: true,
                    worker: true,
                    themes:{
                        dots:false
                    }
                },
                version : 1,
                'plugins': ['types', 'search','checkbox'],
                'search': {
                    show_only_matches: true,
                    show_only_matches_children: true
                },
                'types': {
                    'default': {
                        'icon': 'fa fa-folder'
                    }
                },
                'checkbox':{
                    three_state:false,
                    tie_selection:false,
                    // cascade:'up+down+undetermined'
                }
            };
            return config;
        }
        UtilService.prototype.uploadImg = function(id,onSuccess,onFailed){
            self.cfpLoadingBar.start();
            var formData = new FormData();
            formData.append("files", document.getElementById(id).files[0]);   
                $.ajax({
                    url: baseApiUrl+"framework_common/image",
                    type: "POST",
                    data: formData,
                    contentType: false,//必须false才会自动加上正确的Content-Type
                    processData: false,//必须false才会避开jQuery对 formdata 的默认处理
                    success: function (data) {
                        cfpLoadingBar.complete();
                        if (data.code === 0) {
                            onSuccess(data);
                        }else{
                            if(onFailed)
                                onFailed(data.message);
                            else{
                                UtilService.prototype.alert(data.message);
                            }
                        }
                    },
                    error: function () {
                        cfpLoadingBar.complete();
                        var data = {"code":-1,message:"上传文件失败！请稍后重试！"};
                        if(onFailed)
                            onFailed(data);
                        else
                            UtilService.prototype.alert(data.message);
                    }
                });
        }

        UtilService.prototype.uploadImgByBase64 = function(data,onSuccess,onFailed){
            var params = [data];
            UtilService.prototype.httpRequest('framework_common/image/base64','POST',params,onSuccess,onFailed);
        }

        UtilService.prototype.uploadDoc = function(id,onSuccess,onFailed){
            self.cfpLoadingBar.start();
            var formData = new FormData();
            formData.append("files", document.getElementById(id).files[0]);   
                $.ajax({
                    url: baseApiUrl+"framework_common/document",
                    type: "POST",
                    data: formData,
                    contentType: false,//必须false才会自动加上正确的Content-Type
                    processData: false,//必须false才会避开jQuery对 formdata 的默认处理
                    success: function (data) {
                        cfpLoadingBar.complete();
                        if (data.code === 0) {
                            onSuccess(data);
                        }else{
                            UtilService.prototype.alert('上传文件失败！请稍后重试！');
                        }
                    },
                    beforeSend: function (request) {
                        request.setRequestHeader("X-Token", window.localStorage.getItem("accessToken"));
                    },
                    error: function () {
                        cfpLoadingBar.complete();
                        UtilService.prototype.alert('上传文件失败！请稍后重试！');
                    }
                });
        }

        UtilService.prototype.buildDTData = function(column,data){
            console.log("buildDTData");
            console.log(column);
            console.log(data);
            var result = [];
            for(var i in data){
                var iData = [];
                for(var j in column){
                    if(column[j].data == "" || column[j].data == null)
                        iData.push("");
                    else
                        iData.push(data[i][column[j].data]);
                }
                result.push(iData);
            }
            return result;
        }

        // return
        return UtilService;
    })();
    angularAMD.service("UtilService", ["$rootScope","$uibModal", "notify","cfpLoadingBar","$http",UtilService]);
});
