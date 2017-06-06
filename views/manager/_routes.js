define(["angularAMD", "ocLazyLoad"], function (angularAMD) {

    // register	
    var registerRoutes = function ($stateProvider, $urlRouterProvider) {
        // route
        $stateProvider
            .state("main", angularAMD.route({
                url: "/main",
                abstract: true,
                templateUrl: "views/common/frame_main.html"
            }))

            .state("update", angularAMD.route({
                url: "/update",
                abstract: true,
                templateUrl: "views/common/frame_update.html"
            }))

            .state("static", angularAMD.route({
                url: "/static",
                abstract: true,
                templateUrl: "views/common/frame_static.html"
            }))

            // login
            .state("login", angularAMD.route({
                url: "/login",
                templateUrl: "views/manager/login.html",
                controllerUrl: "views/manager/login.js",
                css:"views/manager/login.css"
            }))

             // index
            .state("index", angularAMD.route({
                url: "/index",
                templateUrl: "views/manager/index.html",
                controllerUrl: "views/manager/index.js",
                css:"views/manager/index.css"
            }))

            // person
            .state("main.person", angularAMD.route({
                url: "/manager/person",
                templateUrl: "views/manager/person.html",
                controllerUrl: "views/manager/person.js",
                css:"views/manager/person.css"
            }))

            // person update
            .state("update.person", angularAMD.route({
                url: "/manager/person/:id/:superDept",
                templateUrl: "views/manager/person_update.html",
                controllerUrl: "views/manager/person_update.js",
                css:"views/manager/person.css"
            }))

            // department
            .state("main.department", angularAMD.route({
                url: "/manager/department",
                templateUrl: "views/manager/department.html",
                controllerUrl: "views/manager/department.js"
            }))

            // department update
            .state("update.department", angularAMD.route({
                url: "/manager/department/:id/:superDept",
                templateUrl: "views/manager/department_update.html",
                controllerUrl: "views/manager/department_update.js"
            }))

            // account
            .state("main.account", angularAMD.route({
                url: "/manager/account",
                templateUrl: "views/manager/account.html",
                controllerUrl: "views/manager/account.js"
            }))

            // account update
            .state("update.account", angularAMD.route({
                url: "/manager/account/:id/:deptId",
                templateUrl: "views/manager/account_update.html",
                controllerUrl: "views/manager/account_update.js",
                css:"views/manager/account.css"
            }))

            // role
            .state("main.role", angularAMD.route({
                url: "/manager/role",
                templateUrl: "views/manager/role.html",
                controllerUrl: "views/manager/role.js",
                css:"views/manager/role.css"
            }))

            // role update
            .state("update.role", angularAMD.route({
                url: "/manager/role/:id",
                templateUrl: "views/manager/role_update.html",
                controllerUrl: "views/manager/role_update.js",
                css:["views/manager/role.css","css/bs-is-fun.css"]
            }))

            // subsystem
            .state("main.subsystem", angularAMD.route({
                url: "/manager/subsystem",
                templateUrl: "views/manager/subsystem.html",
                controllerUrl: "views/manager/subsystem.js"
            }))

            // subsystem update
            .state("update.subsystem", angularAMD.route({
                url: "/manager/subsystem/:id",
                templateUrl: "views/manager/subsystem_update.html",
                controllerUrl: "views/manager/subsystem_update.js"
            }))

            // module
            .state("main.module", angularAMD.route({
                url: "/manager/module",
                templateUrl: "views/manager/module.html",
                controllerUrl: "views/manager/module.js"
            }))

            // module update
            .state("update.module", angularAMD.route({
                url: "/manager/module/:id",
                templateUrl: "views/manager/module_update.html",
                controllerUrl: "views/manager/module_update.js"
            }))

            // menu
            .state("main.menu", angularAMD.route({
                url: "/manager/menu/:id/:code",
                templateUrl: "views/manager/menu.html",
                controllerUrl: "views/manager/menu.js"
            }))

            // module update
            .state("update.menu", angularAMD.route({
                url: "/manager/menu/:id",
                templateUrl: "views/manager/menu_update.html",
                controllerUrl: "views/manager/menu_update.js"
            }))
        ;
    };

    // return
    return registerRoutes;
});