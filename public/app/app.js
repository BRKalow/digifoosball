'use strict';

/* Main App */

var app = angular.module('DigiFoosball', [
  'ui.bootstrap',
  'angularCharts',
  'ngCookies',
  'ngRoute',

  'digiFoosballControllers',
  'digiFoosballServices'
]);

app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'app/partials/index-detail.html',
        controller:  'IndexCtrl'
      }).
      when('/players', {
        templateUrl: 'app/partials/user-list.html',
        controller:  'PlayerListCtrl'
      }).
      when('/players/:userId', {
        templateUrl: 'app/partials/user-detail.html',
        controller:  'PlayerCtrl',
        resolve: {
          player: function(User, $route) {
            var promise = User.resource.get({userId:$route.current.params.userId}).$promise.then(function(data) {
              return data;
            });
            return promise;
          }
        }
      }).
      when('/games', {
        templateUrl: 'app/partials/game-list.html',
        controller:  'GameListCtrl'
      }).
      when('/games/:gameId', {
        templateUrl: 'app/partials/game-detail.html',
        controller:  'GameCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });

      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');
}]);

var digiFoosballControllers = angular.module('digiFoosballControllers', []);
var digiFoosballServices = angular.module('digiFoosballServices', ['ngResource']);
