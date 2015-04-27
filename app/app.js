"use strict";
angular.module('myApp',['ui.router','ui.bootstrap','oc.lazyLoad','dndLists'])
.run(["$rootScope", "$state", function($rootScope,$state){
	$rootScope.$state = $state;
	$rootScope.scoket_url = 'https://localhost/';
	$rootScope.token = 'd11dbd45264b14cf455f6e9f1926dca2';
	$rootScope.user = 'udin';
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
		url:"/login",
		templateUrl:"mod/login/login.html",
		resolve: {
			load: ['$ocLazyLoad',function($ocLazyLoad){
				return $ocLazyLoad.load({
					files: ['mod/login/login.js']
				})
			}]
		}
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
		url: '/all',
		templateUrl: 'mod/board/list.html',
		controller: 'projectCtrl',
	})
	.state('board.a',{
		url: '/new',
		templateUrl: 'mod/board/add.html',
		controller: 'projectCtrl',
	})
	.state('board.d',{
		url: '/:pid',
		templateUrl: 'mod/board/detail.html',
		controller: 'boardCtrl',
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
	.state('store',{
		url: '/store',
		templateUrl: 'mod/store/simple-frame.html',
		controller: 'StoreCtrl as StoreCtrl',
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


