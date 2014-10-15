digiFoosballControllers.controller('IndexCtrl', function($scope, Statistics, User, Game) {
    $scope.$emit('change-title', {title: 'Dashboard'});
    /**
    * Statistics
    */
    Statistics.poll().then(function(data) {
      $scope.stats = data;
    });
    var updateStats = function() {
      $scope.$apply(function() {
        Statistics.poll().then(function(data) {
          $scope.stats = data;
        });
      });
    };
    var statsTimer = setInterval(updateStats, 60000);

    $scope.users = User.allUsers();
    $scope.$on('users-refreshed', function(event, args) {
        $scope.users = User.allUsers();
    });

    $scope.games = Game.latestGames();
    $scope.$on('games-refreshed', function(event, args) {
        $scope.games = Game.latestGames();
    });
});
