(function(angular) {
  'use strict';
    var myApp = angular.module('AWS_POC');
    myApp.service('authService', ['$http', '$q', '$window', function($http, $q, $window) {
      var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
      var poolData = {
          UserPoolId: AuthData.AWS.UserPoolId,
          ClientId: AuthData.AWS.ClientId
      };
      var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

      this.signupToCognito = function(userData) {
        var deferred = $q.defer();
        var attributeList = [];

        var dataEmail = {
            Name: 'email',
            Value: userData.email
        };

        var dataPhoneNumber = {
            Name: 'phone_number',
            Value: userData.phone
        };
        var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
        var attributePhoneNumber = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);

        attributeList.push(attributeEmail);
        attributeList.push(attributePhoneNumber);

        userPool.signUp(userData.username, userData.password, attributeList, null, function(err, result) {
            if (err) {
                console.error(err);
                deferred.reject(err);
                return;
            }
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            deferred.resolve(result);
        });
        return deferred.promise;
      };

      this.confirmCognitoRegistration = function(username, code) {
        var deferred = $q.defer();
        var userData = {
            Username: username,
            Pool: userPool
        };

        var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        cognitoUser.confirmRegistration(code, true, function(err, result) {
            if (err) {
                console.error(err);
                deferred.reject(err);
                return;
            }
            console.log('User registration: ' + result);
            deferred.resolve(result);
        });
        return deferred.promise;
      };

      this.signinToCognito = function(username, password) {
        var deferred = $q.defer();
        var authenticationData = {
            Username: username,
            Password: password,
        };
        var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

        var userData = {
            Username: username,
            Pool: userPool
        };
        var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function(result) {
                $window.sessionStorage.setItem('accessJWTToken', result.getAccessToken().getJwtToken());
                deferred.resolve(result);
            },
            onFailure: function(err) {
                console.error(err);
                deferred.reject(err);
            }
        });
        return deferred.promise;
      };

      this.signoutFromCognito = function() {
        var deferred = $q.defer();
        var cognitoUser = userPool.getCurrentUser();
        if (cognitoUser) {
          cognitoUser.signOut();
          deferred.resolve('SUCCESS')
        }
        else {
          deferred.reject('User not logged in');
        }
        return deferred.promise;
      };

      this.getS3BucketList = function() {
        var accessJWTToken = $window.sessionStorage.getItem('accessJWTToken');
        if(!accessJWTToken) {
          console.error('Invalid token');
          return
        }
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser != null) {
          cognitoUser.getSession(function(err, session) {
            if (err) {
               alert(err);
                return;
            }

             console.log('session validity: ' + session.isValid());

            //POTENTIAL: Region needs to be set if not already set previously elsewhere.
            AWS.config.region = AuthData.AWS.Region;

            // Add the User's Id Token to the Cognito credentials login map.
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: AuthData.AWS.IdentityPoolId, // 'YOUR_IDENTITY_POOL_ID',
                Logins: {
                    // 'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>': session.getIdToken().getJwtToken()
                    ['cognito-idp.' + AuthData.AWS.Region + '.amazonaws.com/' + AuthData.AWS.UserPoolId]: session.getIdToken().getJwtToken()
                }
            });

            AWS.config.credentials.refresh(function(){
               // Your S3 code here...
               // Instantiate aws sdk service objects now that the credentials have been updated.
               var s3 = new AWS.S3();
               var params = {};
               s3.listBuckets(params, function(err, data) {
                 if(err) {
                   console.error(err);
                   return;
                 }
                 console.log(data);
               });
            });
          });
        }
      }

    }]);
})(window.angular);
