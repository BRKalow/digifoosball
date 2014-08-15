'use strict';

/* Services */

var digiFoosballServices = angular.module('digiFoosballServices', ['ngResource']);

digiFoosballServices.factory('User', function($resource) {
    return $resource('/api/user/:userId', {userId:'@id'});
});

digiFoosballServices.factory('Game', function($resource) {
    return $resource('/api/games/:gameId', {gameId:'@id'});
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

digiFoosballServices.factory('Alert', function() {
    var alert = [];

    return {
        setAlert: function(msg) {
          alert[0] = {type: 'info', msg: msg};
        },
        getAlert: function() {
          return alert;
        },
        closeAlert: function(index) {
          alert.splice(index, 1);
        }
    };
});

digiFoosballServices.factory('Stream', ['$rootScope', function($rootScope) {
    var source = new EventSource('/connect');

    source.onmessage = function(event) {
        $rootScope.$broadcast('push-received', { message: JSON.parse(event.data) });
    };
}]);

