(function(angular, myApp) {
    myApp.directive('signin', function() {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'partials/signin.html',
            controller: 'signinController'
        };
    });
})(window.angular, window.myApp);
