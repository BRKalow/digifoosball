'use strict';

/* Services */

var digiFoosballServices = angular.module('digiFoosballServices', ['ngResource']);

digiFoosballServices.factory('User', function($resource, $rootScope) {
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
          $rootScope.$broadcast('users-refreshed', users);
        }
    };
});

digiFoosballServices.factory('Game', function($resource, $rootScope) {
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
            $rootScope.$broadcast('games-refreshed', games);
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

digiFoosballServices.factory('scoreChart', function() {
    var chartType = 'line';
    var config = {
        labels: false,
        title : "",
        legend : {
            display: false,
            position:'right'
        }
    };
    var data = [];

    var buildDataPoints = function(points) {
        var score_history = points.split(",");
        var home_score = 0;
        var away_score = 0;
        var data_points = [{x:"0",y:[0,0]}];

        for(var i = 0; i <= score_history.length; i++) {
            if (score_history[i] == 'home') {
                home_score += 1;
            } else if(score_history[i] == 'away') {
                away_score += 1;
            }

            data_points.push({x: (i+1).toString(), y: [home_score,away_score]});
        }

        return data_points;
    };

    var buildChartConfig = function(dataPoints,playerHomeName,playerAwayName) {
        chartType = 'line';
        config = {
            labels: false,
            title : "",
            legend : {
                display: false,
                position:'right'
            },
            lineCurveType: 'basis',
            colors: ['red','black']
        };
        data = {
            series: [playerHomeName, playerAwayName],
            data : buildDataPoints(dataPoints)
        };
    };

    return {
        getChart: function() {
            return {
                chartType: chartType,
                config: config,
                data: data
            };
        },
        rebuildChartConfig: function(dataPoints,playerHomeName,playerAwayName) {
            buildChartConfig(dataPoints,playerHomeName,playerAwayName);
        }
    };
});

