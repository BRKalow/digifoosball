'use strict';

/* Directives */

/**
 * Loading Directive
 * @see http://tobiasahlin.com/spinkit/
 */
app.directive('loading', function () {
  return {
    restrict: 'AE',
    replace: 'false',
    template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
  };
});

app.directive('userListIndex', function() {
  return {
    restrict: 'AE',
    scope: {users: '=for'},
    templateUrl: 'app/partials/user-list-index.tpl.html',
    replace: true
  };
});

app.directive('recentGamesIndex', function() {
  return {
    restrict: 'AE',
    scope: {games: '=for'},
    templateUrl: 'app/partials/games-list-index.tpl.html',
    replace: true
  };
});

app.directive('gravatar', function() {
  return {
    restrict: 'AE',
    scope: {hash: '=for', gClass: '=gClass'},
    repalce: 'false',
    template: '<img ng-src="http://www.gravatar.com/avatar/{{ hash }}" alt="" class="gravatar {{ gClas }}" />'
  };
});
