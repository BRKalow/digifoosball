'use strict';

/* Main App */

var app = angular.module('DigiFoosball', [
  'ui.bootstrap',
  'ngCookies',
  'ngRoute',

  'digiFoosballControllers',
  'digiFoosballServices'
]);


app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/users', {
        templateUrl: 'app/partials/user-list.html',
        controller:  'UserListCtrl'
      }).
      when('/users/:userId', {
        templateUrl: 'app/partials/user-detail.html',
        controller:  'UserDetailCtrl'
      }).
      when('/games', {
        templateUrl: 'app/partials/game-list.html',
        controller:  'GameListCtrl'
      }).
      when('/games/:gameId', {
        templateUrl: 'app/partials/game-detail.html',
        controller:  'GameDetailCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

