"use strict";
angular.module('scrumban',['ui.router','ui.bootstrap','oc.lazyLoad','dndLists'])
.run(["$rootScope", "$state","$window","$http", function($rootScope,$state,$window,$http){
	$rootScope.$state = $state;

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
		if(toState.name==='login.in'||toState.name==='login.reg'){
			return;
		}
		if(!$window.localStorage.auth){
			event.preventDefault();
			$state.go('login.in');
		}

			var auth = JSON.parse($window.localStorage.auth);
			$rootScope.socket = io.connect(window.location.origin,{query:{token: auth.token}})
	});
}])
.config(["$urlRouterProvider", "$stateProvider", function($urlRouterProvider,$stateProvider) {
	$urlRouterProvider.otherwise("board/all");
	$stateProvider
	.state('404',{
		url:"/404",
		templateUrl:"mod/error/404.html",
		resolve: {
			load: ['$ocLazyLoad',function($ocLazyLoad){
				return $ocLazyLoad.load({
					files: ['mod/error/404.css']
				})
			}]
		}
	})
	.state('login',{
		abstract:true,
		templateUrl:"mod/login/index.html",
		resolve: {
			load: ['$ocLazyLoad',function($ocLazyLoad){
				return $ocLazyLoad.load({
					name: 'loginMod',
					files: ['mod/login/login.js']
				})
			}]
		}

	})
	.state('login.in',{
		url:"/login",
		controller: 'LoginCtrl',
		templateUrl:"mod/login/login.html",
	})
	.state('login.out',{
		url:"/logout",
		controller: 'LoginCtrl',
		templateUrl:"mod/login/login.html",
	})
	.state('login.reg',{
		url:"/register",
		controller: 'RegisterCtrl',
		templateUrl:"mod/login/register.html",
	})
	.state('board',{
		abstract:true, 
		url:"/board",
		templateUrl:"mod/board/index.html",
		resolve: {
			load: ['$ocLazyLoad',function($ocLazyLoad){
				return $ocLazyLoad.load({
					name: 'boardMod',
					files: ['mod/board/board.js','mod/board/board.css']
				})
			}]
		}
	})
	.state('board.l',{
		url: '/',
		templateUrl: 'mod/board/list.html',
		controller: 'ProjectCtrl',
	})
	.state('board.a',{
		url: '/new',
		templateUrl: 'mod/board/add.html',
		controller: 'ProjectCtrl',
	})
	.state('board.d',{
		url: '/:pid',
		templateUrl: 'mod/board/detail.html',
		controller: 'BoardCtrl as board',
	})
	.state('card',{
		abstract:true, 
		url:"/board", 
		templateUrl:"mod/board/index.html",
		resolve: {
			load: ['$ocLazyLoad',function($ocLazyLoad){
				return $ocLazyLoad.load({
					name: 'boardMod',
					files: ['mod/board/board.js','mod/board/board.css']
				})
			}]
		}
	})
	.state('profile',{
		url:"/profile", 
		templateUrl:"mod/profile/index.html",
		controller: 'ProfileCtrl',
		resolve: {
			load: ['$ocLazyLoad',function($ocLazyLoad){
				return $ocLazyLoad.load({
					name: 'profileMod',
					files: ['mod/profile/profile.js']
				})
			}]
		}
	})
	.state('store',{
		url: '/store',
		templateUrl: 'mod/store/simple-frame.html',
		controller: 'StoreCtrl as store',
		resolve: {
			load: ['$ocLazyLoad',function($ocLazyLoad){
				return $ocLazyLoad.load({
					name: 'storeMod',
					files: ['mod/store/store.js','mod/store/simple.css']
				})
			}]
		}
	})
	
}])


