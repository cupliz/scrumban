angular.module('loginMod', [])
.controller('LoginCtrl', function ($scope, $state, $http, $window) {

	$scope.submit = function (input){
		if(input){
			$http.get('/auth',{headers:{'Authorization':'Basic '+btoa(input.username+":"+input.password)}})
			.success(function (data, status, headers, config) {
				$window.localStorage.auth = JSON.stringify(data);
				$state.go('board.l');
			})
			.error(function(data){
				alert(data);
			})
		}
	}
	if($state.current.name==='login.out'){
		$http.delete(/auth/+JSON.parse($window.localStorage.auth).token).success(function(e){
				delete $window.localStorage.auth;
		});
	}
})
.controller('RegisterCtrl', ['$http', function($http){
	
}])
