var isComboTreeOut = true;
define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("sidemenu", function($rootScope, $timeout,UtilService,$compile,$state) {
        return {
            restrict: 'AE',
            link: function (scope, element) {
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

                var onSuccess = function(data){
                    for(var i in data.data){
                        var menuCode = data.data[i].menuCode;
                        if(menuCode.substring(menuCode.length-"index".length) == "index")
                            data.data[i].icon = 'icon-overview';
                        else
                            data.data[i].icon = 'icon-'+menuCode;
                    }
                    scope.menus = buildHierarchy(data.data);
                    
                    if(window.location.href.indexOf('/index')>0){
                       if(scope.menus.length > 0)
                        {
                            var url = scope.menus[0].value.menuUrl;
                            if(scope.menus[0].children != null && scope.menus[0].children.length > 0)
                                url = scope.menus[0].children[0].value.menuUrl;
                            window.location.href = url;
                        }
                    }

                    var html =  
                        '<li ng-class="isActive(menu)" ng-repeat="menu in menus">'+
                        '<a href="{{menu.value.menuUrl}}" class="nav-first-level" ng-click="myClick(menu)">'+
                        '   <i class="fa icon" ng-style="iconImage(menu)"></i>'+
                        '   <span class="nav-label">{{menu.value.menuName}}</span> <span class="fa arrow" ng-show="menu.children.length>0"></span></a>'+
                        '   <ul class="nav nav-second-level collapse" ng-show="menu.children.length>0"  >'+
                        '       <li ng-class="isActive(submenu)" ng-repeat="submenu in menu.children" ui-sref-active="active"><a href="{{submenu.value.menuUrl}}">{{submenu.value.menuName}}</a></li>'+
                        '   </ul>'+
                        '</li>';

                    scope.isIndexActive = function(menu){
                        if($state.includes('main.test_alcohol_index'))
                                return 'active';
                    }

                    scope.myClick = function(menu){
                        if(menu.value.menuUrl != null)
                            window.location.href= menu.value.menuUrl;
                    }

                    scope.iconImage = function(menu){
                        var icon = menu.value.icon;
                        if(icon == null) icon = "icon-"+menu.value.menuCode;
                        
                        if(!scope.isActive(menu) )
                            return {background: 'url("/img/management/'+icon+'.png") no-repeat'};
                        else
                            return {background: 'url("/img/management/'+icon+'_focus.png") no-repeat'};
                    }

                    scope.isActive = function(menu){
                        if($state.includes('*.'+menu.value.menuCode))
                                return 'active';

                        for(var i in menu.children){
                            if($state.includes('*.'+menu.children[i].value.menuCode))
                                return 'active';
                        }
                    }

                    scope.isIn = function(menu){
                        for(var i in menu.children){
                            if($state.includes('*.'+menu.children[i].value.menuCode))
                                return 'in';
                        }
                    }
                    scope.$apply(function(){
                        element.replaceWith($compile(html)(scope));
                        $timeout(function(){
                            $('#side-menu').metisMenu();
                        },200);
                    });
                }
                var urlString = window.location.href;
                var shortUrl = urlString.substr(urlString.indexOf('#'),urlString.length);
                var urlArray = shortUrl.split('/');
                if(urlArray.length<3)
                    alert(urlString);
                UtilService.httpRequest('framework_common/permission/menu', 'GET', {moduleCode:urlArray[2]}, onSuccess); 
            }
        };
    });
});