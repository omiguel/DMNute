

var app = angular.module('devicemanager', [
    'ngAnimate',
    'ngMask',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
])
.config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '../views/login.html',
                controller: 'loginController'
            });
        $routeProvider
            .when('/home', {
                templateUrl: '../views/home.html',
                controller: 'homeController'
            });
    });