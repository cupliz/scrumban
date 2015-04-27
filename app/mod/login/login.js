angular.module('loginMod', [])
.controller('UserCtrl', function ($scope, $http, $window) {
  $scope.submit = function (input) {
    if(input){
    $http.post('/auth', {username: input.username, password: input.password})
      .success(function (data, status, headers, config) {
        $window.sessionStorage.token = data.token;
      })
      .error(function (data, status, headers, config) {
        delete $window.sessionStorage.token;

        $scope.message = 'Error: Invalid user or password';
      });
    }
  };
});