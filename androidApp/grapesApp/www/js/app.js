// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app= angular.module('grapesApp', ['ionic','ui.router','ngCookies','highcharts-ng'])
.config(function ($stateProvider, $urlRouterProvider,$httpProvider) {
  $stateProvider
    .state('login', {
      url: '/',
      templateUrl: 'templates/login.html'
    })
  $stateProvider
    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html'
    })
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html'
    })
	$urlRouterProvider.otherwise('/');
})
.run(run);
    run.$inject = ['$ionicPlatform','$rootScope', '$location', '$cookieStore', '$http'];
    function run($ionicPlatform,$rootScope, $location, $cookieStore, $http) {
	
			$ionicPlatform.ready(function() {
			if(window.cordova && window.cordova.plugins.Keyboard) {
			  // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			  // for form inputs)
			  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

			  // Don't remove this line unless you know what you are doing. It stops the viewport
			  // from snapping when text inputs are focused. Ionic handles this internally for
			  // a much nicer keyboard experience.
			  cordova.plugins.Keyboard.disableScroll(true);
			}
			if(window.StatusBar) {
			  StatusBar.styleDefault();
			}
		  });
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }
