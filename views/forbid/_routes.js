define(["angularAMD", "ocLazyLoad"], function (angularAMD) {

    // register	
    var registerRoutes = function ($stateProvider, $urlRouterProvider) {
        // route
        $stateProvider
            // 长期通行证申请
            .state("update.forbid_long_pass", angularAMD.route({
                url: "/forbid/long_pass/:type/:id",
                templateUrl: "views/forbid/long_pass.html",
                controllerUrl: "views/forbid/long_pass.js",
                css:["views/forbid/long_pass.css","css/bs-is-fun.css"]
            }))

            // 临时通行证申请
            .state("update.forbid_temp_pass", angularAMD.route({
                url: "/forbid/temp_pass/:type/:id",
                templateUrl: "views/forbid/temp_pass.html",
                controllerUrl: "views/forbid/temp_pass.js",
                css:["views/forbid/temp_pass.css","css/bs-is-fun.css"]
            }))

            // 设置
            .state("main.forbid_setting", angularAMD.route({
                url: "/forbid/setting",
                templateUrl: "views/forbid/setting.html",
                controllerUrl: "views/forbid/setting.js",
                css:"views/forbid/setting.css"
            }))
            //会审
            .state("main.forbid_reviews", angularAMD.route({
                url: "/forbid/reviews",
                templateUrl: "views/forbid/reviews.html",
                controllerUrl: "views/forbid/reviews.js",
                css:"views/forbid/pass_print.css"
            }))

            //通行证审批
            .state("main.approve", angularAMD.route({
                url: "/forbid/approve",
                templateUrl: "views/forbid/approve.html",
                controllerUrl: "views/forbid/approve.js",
                css:"views/forbid/pass_print.css"
            }))
            
            //限额配置
            .state("main.limit_setting", angularAMD.route({
                url: "/forbid/limit",
                templateUrl: "views/forbid/limit_setting.html",
                controllerUrl: "views/forbid/limit_setting.js",
                css:"views/forbid/limit_setting.css"
            }))



            // 通行范围
            .state("main.forbid_pass_area", angularAMD.route({
                url: "/forbid/pass_area",
                templateUrl: "views/forbid/pass_area.html",
                controllerUrl: "views/forbid/pass_area.js",
                css:"views/forbid/pass_area.css"
            }))

            // 通行范围
            .state("main.forbid_forbid_area", angularAMD.route({
                url: "/forbid/forbid_area",
                templateUrl: "views/forbid/forbid_area.html",
                controllerUrl: "views/forbid/forbid_area.js",
                css:"views/forbid/forbid_area.css"
            }))

            .state("update.forbid_forbid_area", angularAMD.route({
                url: "/forbid/forbid_area/:id",
                templateUrl: "views/forbid/forbid_area_update.html",
                controllerUrl: "views/forbid/forbid_area_update.js",
                css:"views/forbid/forbid_area_update.css"
            }))

            .state("update.forbid_pass_area", angularAMD.route({
                url: "/forbid/pass_area/:id",
                templateUrl: "views/forbid/pass_area_update.html",
                controllerUrl: "views/forbid/pass_area_update.js",
                css:"views/forbid/pass_area_update.css"
            }))
            
            //通行证打印
            .state("main.pass_print", angularAMD.route({
                url: "/forbid/pass_print",
                templateUrl: "views/forbid/pass_print.html",
                controllerUrl: "views/forbid/pass_print.js",
                css:"views/forbid/pass_print.css"
            }))
            //通行证预览
            .state("update.forbid_pass_preview", angularAMD.route({
                url: "/forbid/pass_preview/:id",
                templateUrl: "views/forbid/pass_preview.html",
                controllerUrl: "views/forbid/pass_preview.js",
                css:["views/forbid/pass_preview.css"]
            }))
            
            //通行证查询
            .state("main.pass_query", angularAMD.route({
                url: "/forbid/pass_query",
                templateUrl: "views/forbid/pass_query.html",
                controllerUrl: "views/forbid/pass_query.js",
                css:"views/forbid/pass_print.css"
            }))
            
            //通行证数据补录
            .state("main.pass_makeup", angularAMD.route({
                url: "/forbid/pass_makeup",
                templateUrl: "views/forbid/pass_makeup.html",
                controllerUrl: "views/forbid/pass_makeup.js",
                css:"views/forbid/pass_print.css"
            }))
        ;
    };

    // return
    return registerRoutes;
});