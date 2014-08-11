'use strict';

/* Services */

var digiFoosballServices = angular.module('digiFoosballServices', ['ngResource']);

digiFoosballServices.factory('User', function($resource) {
  return $resource('/api/user/:userId');
});

digiFoosballServices.factory('Game', function($resource) {
  return $resource('/api/games/:gameId');
});

digiFoosballServices.service('Statistics', function($http) {
  var Statistics = {
    async: function() {
      var promise = $http.get('/api/statistics').then(function (response) {
        return response.data;
      });
      return promise;
    }
  };
  return Statistics;
});

