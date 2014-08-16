'use strict';

/* Services */

var digiFoosballServices = angular.module('digiFoosballServices', ['ngResource']);

digiFoosballServices.factory('User', function($resource) {
    var users = [];
    var resource = $resource('/api/user/:userId', {userId:'@id'});
    return {
        resource: resource,
        allUsers: function() {
            if(users.length == 0) {
                users = resource.query();
            }
            return users;
        },
        refreshUsers: function() {
          users = resource.query();
        }
    };
});

digiFoosballServices.factory('Game', function($resource) {
    var games = [];
    var resource = $resource('/api/games/:gameId', {gameId:'@id'});
    return {
        resource: resource,
        allGames: function() {
            if(games.length == 0) {
                games = resource.query();
            }
            return games;
        },
        refreshGames: function() {
            games = resource.query();
        }
    };
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
        var parsedData = JSON.parse(event.data);

        $rootScope.$broadcast('push-received', { message: parsedData });

        if (service.handlers.onmessage) {
            $rootScope.$apply(function() {
                service.handlers.onmessage.apply(source,[parsedData]);
            });
        }
    };

    var service = {
        handlers: {},
        onmessage: function(callback) {
          this.handlers.onmessage = callback;
        }
    };

    return service;
}]);

