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

        var profileState = {
            name: 'profile',
            url: '/profile',
            templateUrl: 'templates/profile.html',
            controller: 'profileController'
        };

        $stateProvider.state(signupState);
        $stateProvider.state(signinState);
        $stateProvider.state(profileState);
    });

    window.AuthData = {
        "AWS": {
            "UserPoolId": "ap-south-1_E6Riai7xi",
            "ClientId": "4cvdo1mvnomaist56v6f5gq44r",
            "Region": "ap-south-1"
        }
    }

})(window.angular);
