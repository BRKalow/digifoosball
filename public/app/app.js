'use strict';

/* Main App */

var app = angular.module('DigiFoosball', [
  'ui.bootstrap',
  'ngCookies',
  'ngRoute',

  'digiFoosballControllers',
  'digiFoosballServices'
]);


app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/app/partials/index-detail.html',
        controller:  'MainCtrl'
      }).
      when('/players', {
        templateUrl: 'app/partials/user-list.html',
        controller:  'MainCtrl'
      }).
      when('/players/:userId', {
        templateUrl: 'app/partials/user-detail.html',
        controller:  'MainCtrl'
      }).
      when('/games', {
        templateUrl: 'app/partials/game-list.html',
        controller:  'MainCtrl'
      }).
      when('/games/:gameId', {
        templateUrl: 'app/partials/game-detail.html',
        controller:  'MainCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });

      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');
  }]);

