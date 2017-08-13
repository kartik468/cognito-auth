(function(angular, myApp) {
    myApp.directive('signup', function() {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'partials/signup.html',
            controller: 'signupController'
        };
    });
})(window.angular, window.myApp);
