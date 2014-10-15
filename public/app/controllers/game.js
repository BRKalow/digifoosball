digiFoosballControllers.controller('GameCtrl', function($scope, $routeParams, $location, Game, scoreChart, $http) {
    $scope.$emit('change-title', {title: 'Game'});
    $scope.game = Game.resource.get({gameId:$routeParams.gameId});
    $scope.chart = scoreChart.getChart();
    $scope.gameGoingOn = Game.activeGames();
    $scope.rebuildChart = function() {
        scoreChart.rebuildChartConfig($scope.game.score_history, $scope.game.player_home.name, $scope.game.player_away.name);
    };
    $scope.rematch = function() {
        var newGame = new Game.resource({player_home_id:$scope.game.player_home.id,
                                         player_away_id:$scope.game.player_away.id,
                                         league_game:$scope.game.league_game,
                                         manual:$scope.game.manual});
        newGame.$save(function(g, headers) {
            Game.refreshGames();
            Game.refreshActiveGames();
            $location.path('games/'+g.id);
        });
    };
    $scope.incrementScore = function(team) {
        $http.get('manual_score/'+$scope.game.id+'/'+team);
    };

    $scope.$on('active-games-refreshed', function(event, args) {
        $scope.gameGoingOn = Game.activeGames();
    });

    /**
    * Stream
    */
    $scope.$on('game-push-received', function(event, args) {
        var receivedGame = args.receivedGame;
        if(receivedGame.id == $routeParams.gameId) {
            $scope.game = receivedGame;
            $scope.rebuildChart();
            $scope.chart = scoreChart.getChart();
        }
    });

    $scope.game.$promise.then(function() {
        $scope.rebuildChart();
        $scope.chart = scoreChart.getChart();
    });
});
