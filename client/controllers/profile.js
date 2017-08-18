(function(angular, myApp) {
  'use strict';
  var myApp = angular.module('AWS_POC');
  myApp.controller('profileController', ['$scope', '$state', '$window', 'authService', function($scope, $state, $window, authService) {
      $scope.signout = function() {
        var resultPromise = authService.signoutFromCognito();
        resultPromise.then(function(result) {
          console.log('logout: ' + result);
          // $state.go("signin");
        }, function(err) {
          console.error('Failed: ' + (err.data.message || err.data));
        });
      };

      $scope.listS3Buckets = function() {
        var resultPromise = authService.listS3Buckets();
        resultPromise.then(function(result) {
          console.log('SUCCESS');
          console.log(result);
          // $state.go("signin");
        }, function(err) {
          console.error('Failed: ' + (err.data.message || err.data));
        });
      }
  }]);
})(window.angular);
