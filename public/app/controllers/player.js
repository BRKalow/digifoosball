digiFoosballControllers.controller('PlayerCtrl', function($scope, $routeParams, User, rankingChart, player) {
    $scope.$emit('change-title', {title: 'Player'});
    $scope.user = player;
    $scope.chart = rankingChart.getChart();
    $scope.rebuildChart = function() {
        rankingChart.rebuildChartConfig($scope.user);
    };

    $scope.totalGoals = User.totalGoals($scope.user);
    $scope.percent_scored = User.percentGoalsScored($scope.user);
    $scope.percent_given = User.percentGoalsGiven($scope.user);
    $scope.totalGames = $scope.user.games_played;
    $scope.percent_wins = User.percentWins($scope.user);
    $scope.percent_losses = User.percentLosses($scope.user);
    $scope.rebuildChart();
    $scope.chart = rankingChart.getChart();
});
