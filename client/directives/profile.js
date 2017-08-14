(function(angular) {
  'use strict';
  var myApp = angular.module('AWS_POC');
  myApp.directive('profile', function() {
      return {
          restrict: 'E',
          scope: true,
          templateUrl: 'partials/profile.html',
          controller: 'profileController'
      };
  });
})(window.angular);
