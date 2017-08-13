myApp.controller('signinController', ['$scope', function($scope) {

    $scope.username = "";
    $scope.password = "";

    var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
    var poolData = {
        UserPoolId: AuthData.AWS.UserPoolId,
        ClientId: AuthData.AWS.ClientId
    };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    $scope.submitForm = function() {
        var authenticationData = {
            Username: $scope.username,
            Password: $scope.password,
        };
        var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
        
        var userData = {
            Username: $scope.username,
            Pool: userPool
        };
        var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function(result) {
                // console.log('access token + ' + result.getAccessToken().getJwtToken());
                console.log('Successfully logged in');

                //POTENTIAL: Region needs to be set if not already set previously elsewhere.
                AWS.config.region = AuthData.AWS.region;

                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: '...', // your identity pool id here
                    Logins: {
                        // Change the key below according to the specific region your user pool is in.
                        'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>': result.getIdToken().getJwtToken()
                    }
                });

                var cognitoUser = userPool.getCurrentUser();
                // Instantiate aws sdk service objects now that the credentials have been updated.
                // example: var s3 = new AWS.S3();

            },

            onFailure: function(err) {
                alert(err);
            },

        });
    }

}]);