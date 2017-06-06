var u = navigator.userAgent; 
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
var isMobile = false;
if(typeof(cordova) !== 'undefined')isMobile = true;

var httpRequest = function($ionicPopup,$ionicLoading,url,action,params,onSuccess,onFailed,onError){
	if(!checkNetwork()){
		onFailed({code:-100,message:"无网络链接"});
		return;
	}

	$ionicLoading.show({template: 'Loading...'});
	console.log(params);
	if(action.toUpperCase() != 'GET') params = JSON.stringify(params);
	
    $.ajax({
        url: baseApiUrl +url,
        data:params,
        type:action,
        traditional: true,
        cache:false,
        dataType:'json',
        beforeSend: function(request) {
            request.setRequestHeader("X-Token", window.localStorage.getItem("accessToken"));
        },
		contentType: "application/json;charset=UTF-8",
        success:function(data){
			$ionicLoading.hide();

            if(data.code == 0){
                if(typeof(onSuccess) != "undefined") onSuccess(data);
            }else{
                if(typeof(onFailed) == "undefined"){
                    $ionicPopup.alert({
                        //title:'错误',
                        template: data.message
                    });
                }else{
                    onFailed(data);
                }
            }
        },
        error:function(obj,message) {
			$ionicLoading.hide();
				console.log(onFailed);
			if(typeof(onError) != "undefined"){
				onError({code:'-1',message:message});
			}else if(typeof(onFailed) != "undefined"){
				onFailed({code:'-1',message:message});
			}else{
				$ionicPopup.alert({
					title:'错误',
					template: '系统连接异常'
				});
			}
		}
    });
};


Date.prototype.format = function(format){ 
	var o = { 
		"M+" : this.getMonth()+1, //month 
		"d+" : this.getDate(), //day 
		"h+" : this.getHours(), //hour 
		"m+" : this.getMinutes(), //minute 
		"s+" : this.getSeconds(), //second 
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
		"S" : this.getMilliseconds() //millisecond 
	} 

	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 

	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 
	return format; 
}

Date.prototype.addDays = function(days){ 
	this.setDate(this.getDate()+days); 
	return this; 
}

String.prototype.startWith=function(str){  
	if(str==null||str==""||this.length==0||str.length>this.length)  
		return false;  
	if(this.substr(0,str.length)==str)  
		return true;  
	else  
		return false;
};

String.prototype.endWith=function(str){  
	if(str==null||str==""||this.length==0||str.length>this.length)  
		return false;  
	if(this.substring(this.length-str.length)==str)  
		return true;  
	else  
		return false;
}

String.prototype.contains=function(str){
	return this.indexOf(str) >= 0;
}

function StrToDate(str ){
	str = str.replace(/-/g,"/");
	return new Date(str );
}


function getCountDays(curDate) {
	/* 获取当前月份 */
	var curMonth = curDate.getMonth();
	/*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
	curDate.setMonth(curMonth + 1);
	/* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
	curDate.setDate(0);
	/* 返回当月的天数 */
	return curDate.getDate();
}

function PadL(num, n,c) {
	return (Array(n).join(c) + num).slice(-n);
}

//读取cookies
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"); //正则匹配
    if(arr=document.cookie.match(reg)){
      return unescape(arr[2]);
    }
    else{
     return null;
    }
} 

//删除cookies
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null){
      document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
} 

//设置固定过期时间的cookies
function setCookie(name,value)
{
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

var safeApply = function($scope,callback){
	callback();
	($scope.$$phase)?function(){}:$scope.$apply();
}