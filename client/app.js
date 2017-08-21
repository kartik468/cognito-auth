(function(angular) {
    'use strict';

    var myApp = angular.module('AWS_POC', ['ui.router']);
    window.myApp = myApp;

    myApp.config(function($stateProvider) {
        var signinState = {
            name: 'signin',
            url: '/signin',
            templateUrl: 'templates/signin.html',
            controller: 'signinController'
        };

        var signupState = {
            name: 'signup',
            url: '/signup',
            templateUrl: 'templates/signup.html',
            controller: 'signupController'
        };

        var s3BucketsState = {
            name: 's3Buckets',
            url: '/s3Buckets',
            templateUrl: 'templates/buckets.html',
            controller: 'bucketsController'
        };

        var s3BucketState = {
            name: 's3Bucket',
            url: '/s3Buckets/s3Bucket/:bucketName',
            templateUrl: 'templates/bucket.html',
            controller: 'bucketController'
        };

        var fileDisplayState = {
            name: 'displayImage',
            url: '/s3Buckets/s3Bucket/:bucketName/:fileName',
            templateUrl: 'templates/display-image.html',
            controller: 'displayImageController'
            // ,
            // resolve: {
            //     translations: "authService",
            //     getFileData: function(translations, $stateParams) {
            //       return translations.downloadObject($stateParams.bucketName, $stateParams.fileName);
            //    }
            // }
        }

        $stateProvider.state(signupState);
        $stateProvider.state(signinState);
        $stateProvider.state(s3BucketsState);
        $stateProvider.state(s3BucketState);
        $stateProvider.state(fileDisplayState);
    });
})(window.angular);
