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
          console.error('Failed: ' + err);
        });
      };

      $scope.listS3BucketsList = function() {
        authService.getS3BucketList();
      }
  }]);
})(window.angular);
