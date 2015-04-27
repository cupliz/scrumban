angular.module("shareFactory")
.factory('auth',auth)
.service('session', session);
.filter('capitalize', function() {
  return function (s,all){
    if(s){return (!all)? s && s[0].toUpperCase() + s.slice(1) : s.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });}
  }
});

function auth($http, session) {
  var authService = {};
  authService.login = function (credentials) {
    return $http.post('/login', credentials).then(function (res) {
        Session.create(res.data.id, res.data.user.id,
                       res.data.user.role);
        return res.data.user;
      });
  };
 
  authService.isAuthenticated = function () {
    return !!Session.userId;
  };
 
  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
  };
 
  return authService;
};

function session() {
  this.create = function (sessionId, userId, userRole) {
    this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
    this.userRole = null;
  };
  return this;
};