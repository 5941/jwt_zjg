define(["angularAMD", "ocLazyLoad"], function (angularAMD) {

    // register	
    var registerRoutes = function ($stateProvider, $urlRouterProvider) {
        // route
        $stateProvider

        // auth
            .state("auth", angularAMD.route({
                url: "/auth",
                abstract: true,
                templateUrl: "views/common/content.html"
            }))

            // user
            .state("auth.user", angularAMD.route({
                url: "/user",
                templateUrl: "views/auth/user.html",
                controllerUrl: "views/auth/user.js"
            }))

            // department
            .state("auth.department", angularAMD.route({
                url: "/department",
                templateUrl: "views/auth/department.html",
                controllerUrl: "views/auth/department.js",
                data: {
                    pageTitle: '部门管理',
                },
                resolve: {
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            
                        ]);
                    }
                }
            }))
            // department new
            .state("auth.departmentNew", angularAMD.route({
                url: '/departmentNew',
                templateUrl: 'views/auth/departmentNew.html',
                controllerUrl: 'views/auth/departmentNew.js',
                data: {
                    pageTitle: '新增部门',
                    specialClass: 'fixed-sidebar'
                }
            }))
            .state("auth.departmentDetail", angularAMD.route({
                url: '/departmentDetail/:id',
                templateUrl: 'views/auth/departmentDetail.html',
                controllerUrl: 'views/auth/departmentDetail.js'
            }))
        ;
    };

    // return
    return registerRoutes;
});