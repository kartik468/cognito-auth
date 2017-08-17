var express = require('express');
var router = express.Router();

var AWS = require('aws-sdk');
var AWSCognito = require('amazon-cognito-identity-js');

var Auth = require('../config/auth');

var poolData = {
    UserPoolId : Auth.AWS.UserPoolId,
    ClientId : Auth.AWS.ClientId
};

var userPool = new AWSCognito.CognitoUserPool(poolData);

router.post('/signup', function(req, res, next) {
  var attributeList = [];
  var dataEmail = {
      Name : 'email',
      Value : req.body.email
  };
  var attributeEmail = new AWSCognito.CognitoUserAttribute(dataEmail);

  var dataPhoneNumber = {
      Name: 'phone_number',
      Value: req.body.phone
  };
  var attributePhoneNumber = new AWSCognito.CognitoUserAttribute(dataPhoneNumber);

  attributeList.push(attributeEmail);
  attributeList.push(attributePhoneNumber);
  var username = req.body.username;
  var password = req.body.password;

  userPool.signUp(username, password, attributeList, null, function(err, result){
      if (err) {
        res.status(400).send(err);
        return;
      }
      req.session.cognitoUserName = result.user.getUsername();
      req.session.cognitoUserConfirmed = result.userConfirmed;
      res.send(result);
  });
});

router.post('/verify-code', function(req, res, next) {
  var userData = {
      Username : req.session.cognitoUserName,
      Pool : userPool
  };

  var cognitoUser = new AWSCognito.CognitoUser(userData);
  cognitoUser.confirmRegistration(req.body.code, true, function(err, result) {
    if (err) {
      res.status(400).send(err);
      return;
    }
    res.send(result);
  });
});

router.post('/resend-code', function(req, res, next) {
  var userData = {
      Username : req.session.cognitoUserName,
      Pool : userPool
  };

  var cognitoUser = new AWSCognito.CognitoUser(userData);
  cognitoUser.resendConfirmationCode(function(err, result) {
      if (err) {
        res.send(err);
        return;
      }
      res.send(result);
  });
});

router.post('/signin', function(req, res, next) {
  var authenticationData = {
       Username : req.body.username,
       Password : req.body.password,
   };
   var authenticationDetails = new AWSCognito.AuthenticationDetails(authenticationData);

   var userData = {
     Username : req.body.username,
     Pool : userPool
   };
   var cognitoUser = new AWSCognito.CognitoUser(userData);
   cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
          req.session.cognitoUserData = result;
          req.session.cognitoUserName = req.body.username;
          res.send(result);
      },
      onFailure: function(err) {
          res.status(400).send(err);
      }
    });
});

router.get('/listS3Buckets', function(req, res, next) {
  // res.render('cognito/profile', {messages: messages, hasErrors: messages.length > 0});

  //POTENTIAL: Region needs to be set if not already set previously elsewhere.
  AWS.config.region = Auth.AWS.Region;

  // Add the User's Id Token to the Cognito credentials login map.
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: Auth.AWS.IdentityPoolId, // 'YOUR_IDENTITY_POOL_ID',
      Logins: {
          // 'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>': session.getIdToken().getJwtToken()
          ['cognito-idp.' + Auth.AWS.Region + '.amazonaws.com/' + Auth.AWS.UserPoolId]: req.session.cognitoUserData.idToken.jwtToken
      }
  });

  AWS.config.credentials.refresh(function(){
     // Your S3 code here...
     // Instantiate aws sdk service objects now that the credentials have been updated.
     var s3 = new AWS.S3();
     var params = {};
     s3.listBuckets(params, function(err, bucketData) {
       if(err) {
         console.error(err);
         res.status(400).send(err);
       }
        //  console.log(data);
        /* The following example list two objects in a bucket. */
        // var params = {
        //     Bucket: bucketData.Buckets[0].Name,
        //     MaxKeys: 2
        // };
        // s3.listObjects(params, function(err, bucketObjects) {
        //    if (err) {
        //      console.log(err, err.stack); // an error occurred
        //    }
        //   //  console.log(bucketObjects);
        //
        //    var params = {
        //     Bucket: bucketData.Buckets[0].Name,
        //     Key: bucketObjects.Contents[0].Key
        //    };
        //    s3.getObject(params, function(err, data) {
        //      if (err) {
        //         console.log(err, err.stack); // an error occurred
        //      }
        //      res.send(data);           // successful response
        //    });
        //  });

        res.json(bucketData);
     });
  });
});

router.post('/getUsername', function(req, res, next) {
  // var cognitoUser = userPool.getCurrentUser();
  var userData = {
    Username : req.session.cognitoUserName,
    Pool : userPool
  };
  var cognitoUser = new AWSCognito.CognitoUser(userData);
  res.send(cognitoUser.username);
});

module.exports = router;
