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
        },
        totalGoals: function(user) {
            return user.goals_scored + user.goals_given;
        },
        percentGoalsScored: function(user) {
            return (100 * user.goals_scored / this.totalGoals(user)).toFixed(2);
        },
        percentGoalsGiven: function(user) {
            return (100 * user.goals_given / this.totalGoals(user)).toFixed(2);
        },
        percentWins: function(user) {
            return (100 * user.wins / user.games_played).toFixed(2);
        },
        percentLosses: function(user) {
            return (100 * user.losses / user.games_played).toFixed(2);
        }
    };
});

digiFoosballServices.factory('Game', function($resource, $rootScope) {
    var games = [];
    var resource = $resource('/api/games/:gameId', {gameId:'@id'});
    var gameGoingOn = [];
    return {
        resource: resource,
        allGames: function() {
            if(games.length == 0) {
                games = resource.query();
            }
            return games;
        },
        latestGames: function() {
            return resource.query({limit:'5'});
        },
        refreshGames: function() {
            games = resource.query();
            $rootScope.$broadcast('games-refreshed', games);
        },
        activeGames: function() {
            if (gameGoingOn.length == 0) {
                gameGoingOn = resource.query({finished:'0'});
            }
            return gameGoingOn;
        },
        refreshActiveGames: function() {
            gameGoingOn = resource.query({finished:'0'});
            $rootScope.$broadcast('active-games-refreshed', gameGoingOn);
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

digiFoosballServices.factory('rankingChart', function() {
    var chartType = 'line';
    var config = {
        labels: false,
        title : "",
        legend : {
            display: false,
            position:'right'
        },
        lineLegend: "traditional"
    };
    var data = [];

    var buildDataPoints = function(player) {
        var dataPoints = [];
        var limit = (player.games.length < 10) ? player.games.length : 10;
        var currentRating = player.rating;
        var games = player.games.sort(function(a, b){ return a.id - b.id });

        if(games.length == 0) {
            dataPoints.unshift({x: "0", y: [0]});
            return dataPoints;
        }
        
        for(var i = 1; i <= limit; i++) {
            var game = games[games.length - i];
            var ratingChange = (game.player_home_id == player.id) ? game.home_rating_change:game.away_rating_change;
            if(game.player_home_id == player.id && game.score_away == 5 ||
               game.player_away_id == player.id && game.score_home == 5) {
                ratingChange *= -1;
            }
            dataPoints.unshift({x: (limit+1-i).toString(), y: [currentRating]});
            currentRating -= ratingChange;
        }

        return dataPoints;
    };

    var buildChartConfig = function(player) {
        chartType = 'line';
        config = {
            labels: false,
            tooltips: false,
            title : "",
            legend : {
                display: false,
                position:'right'
            },
            lineCurveType: 'basis',
            colors: ['green']
        };
        data = {
            series: [''],
            data : buildDataPoints(player)
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
        rebuildChartConfig: function(player) {
            buildChartConfig(player);
        }
    };
});

