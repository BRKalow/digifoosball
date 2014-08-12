'use strict';

/* Services */

var digiFoosballServices = angular.module('digiFoosballServices', ['ngResource']);

digiFoosballServices.factory('User', function($resource) {
  return $resource('/api/user/:userId', {userId:'@id'});
});

digiFoosballServices.factory('Game', function($resource) {
  return $resource('/api/games/:gameId', {userId:'@id'});
});

digiFoosballServices.service('Statistics', function($http,$q) {
  var Statistics = {
    poll: function() {
      var deferred = $q.defer();
      $http.get('/api/statistics').then(function (response) {
        deferred.resolve(response.data); 
      });
      return deferred.promise;
    }
  };
  return Statistics;
});

