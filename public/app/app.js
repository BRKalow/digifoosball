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
      when('/games/:gameId', {
        templateUrl: 'app/partials',
        controller:  'GameCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

