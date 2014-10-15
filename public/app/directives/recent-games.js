app.directive('recentGamesIndex', function() {
  return {
    restrict: 'AE',
    scope: {games: '=for'},
    templateUrl: 'app/partials/games-list-index.tpl.html',
    replace: true
  };
});
