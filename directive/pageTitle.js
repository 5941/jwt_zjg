define(['angularAMD'], function (angularAMD, factory) {

    angularAMD.directive("pageTitle", function($rootScope, $timeout) {
        return {
            link: function (scope, element) {
                var listener = function (event, toState, toParams, fromState, fromParams) {
                    // Default title - load on Dashboard 1
                    var title = '警务通';
                    // Create your own title pattern
                    if (toState.data && toState.data.pageTitle) title = '警务通 | ' + toState.data.pageTitle;
                    $timeout(function () {
                        element.text(title);
                    });
                };
                $rootScope.$on('$stateChangeStart', listener);
            }
        }
    });
});