define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("toggleAddon", function ($rootScope, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.bind("click", function () {
                    var addon = element.closest("form").siblings("form").find("#addon");
                    element.children("label").html(addon.is(":hidden")?"收起筛选":"高级筛选");
                    var deg = addon.is(":hidden")?"180deg":"0deg";
                    element.children("img").css({"transform":"rotate("+deg+")"});
                    addon.slideToggle();
                });
            }
        }
    })
});