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
