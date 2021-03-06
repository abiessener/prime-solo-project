// this is almost entirely taken from the provided starter repo. implements basic local-strategy passport.js functionality as well as our editUser AJAX

myApp.factory('UserService', function ($http, $location, $mdToast) {
  // console.log('UserService Loaded');

  var userObject = {};

  var fileStack = filestack.init('A7WAgJVAQ4S4JdB1w30hFz');

  return {
    userObject: userObject,

    fileStack: fileStack,

    getuser: function () {
      // console.log('UserService -- getuser');
      $http.get('/user').then(function (response) {
        if (response.data.username) {
          // user has a current session on the server
          userObject.userName = response.data.username;
          userObject.avatar_url = response.data.avatar_url;
          // console.log('UserService -- getuser -- User Data: ', userObject.userName);
        } else {
          // console.log('UserService -- getuser -- failure');
          // user has no session, bounce them back to the login page
          $location.path("/home");
        }
      }, function (response) {
        // console.log('UserService -- getuser -- failure: ', response);
        $location.path("/home");
      });
    },

    editCurrentUser: function (name, avatar_url) {
      // console.log('UserService.editCurrentUser()', name);
      $http.put('/user', {
        username: name,
        avatar_url: avatar_url
      }).then(function (response) {
          // console.log('UserService PUT request response:', response);
          $mdToast.show(
            $mdToast.simple()
            .textContent('User updated!')
            .hideDelay(3000)
          );
          $location.path('/client-list')
        },
        function (response) {
          console.log('UserService PUT request ERROR SEND UP THE FLARES EVERYTHING IS TERRIBLE');
        });
    },

    logout: function () {
      // console.log('UserService -- logout');
      $http.get('/user/logout').then(function (response) {
        // console.log('UserService -- logout -- logged out');
        userObject.avatar_url = false;
        $mdToast.show(
          $mdToast.simple()
          .textContent('Logged out.')
          .hideDelay(3000)
        );
        $location.path("/home");
      });
    }
  };
});