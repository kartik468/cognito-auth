myApp.controller('signupController', ['$scope', function($scope) {

    $scope.email = "";
    $scope.username = "";
    $scope.password = "";
    $scope.confirmRegistrationForm = false;

    var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
    var poolData = {
        UserPoolId: AuthData.AWS.UserPoolId,
        ClientId: AuthData.AWS.ClientId
    };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    $scope.submitForm = function() {
        var attributeList = [];

        var dataEmail = {
            Name: 'email',
            Value: $scope.email
        };

        var dataPhoneNumber = {
            Name: 'phone_number',
            Value: '+15555555555'
        };
        var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
        var attributePhoneNumber = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);

        attributeList.push(attributeEmail);
        attributeList.push(attributePhoneNumber);

        userPool.signUp($scope.username, $scope.password, attributeList, null, function(err, result) {
            if (err) {
                console.error(err);
                return;
            }
            cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            $scope.confirmRegistrationForm = true;
            $scope.$digest();
        });
    };

    $scope.confirmRegistration = function() {
        var userData = {
            Username: $scope.username,
            Pool: userPool
        };

        var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        cognitoUser.confirmRegistration($scope.code, true, function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            console.log('User registration: ' + result);
        });
    }

}]);