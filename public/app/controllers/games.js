digiFoosballControllers.controller('GameListCtrl', function($scope, Game) {
    $scope.$emit('change-title', {title: 'Games'});
    $scope.games = Game.allGames();
    $scope.$on('games-refreshed', function(event, args) {
        $scope.games = Game.allGames();
    });
});
