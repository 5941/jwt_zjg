define(

    // routes
    [
        "views/auth/_routes.js",
        "views/manager/_routes.js",
        "views/forbid/_routes.js"
    ],

    // register
    function () {
        // routes
        var routes = arguments;

        // register	
        var registerRoutes = function ($stateProvider, $urlRouterProvider) {
            for (var i = 0; i < routes.length; i++) {
                routes[i]($stateProvider, $urlRouterProvider);
            }
            
            $urlRouterProvider.otherwise("/login");
        };

        // return
        return registerRoutes;
    }
);