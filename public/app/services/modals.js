digiFoosballServices.factory('Modals', ['User', 'Game', 'Alert', '$rootScope', '$location', '$modal', function(User, Game, Alert, $rootScope, $location, $modal) {
    return {
        newGame: {
            create: function(scope) {
                $rootScope.$broadcast('modal-opened');
                return $modal.open({
                    templateUrl: 'app/partials/new-game-modal.tpl.html',
                    backdrop: 'static',
                    scope: scope
                });
            },
            success: function(values) {
                if(values[2]) values[2] = 1;
                if(!values[2]) values[2] = 0;
                if(values[3] === false) values[3] = 1;
                if(values[3] === true) values[3] = 0;
                $rootScope.$broadcast('modal-closed');
                if(values[0].id == values[1].id) {
                    Alert.setAlert('You can\'t create a game with one person!');
                    return;
                }
                var newGame = new Game.resource({
                    player_home_id:values[0].id,
                    player_away_id:values[1].id,
                    league_game:values[2],
                    manual:values[3]
                });
                newGame.$save(function(g, headers) {
                    Game.refreshGames();
                    Game.refreshActiveGames();
                    $rootScope.$broadcast('game-push-received', { receivedGame: g });
                    $location.path('games/'+g.id);
                });
            },
            error: function(error) {
                $rootScope.$broadcast('modal-closed');
            }
        },
        newPlayer: {
            create: function(scope) {
                $rootScope.$broadcast('modal-opened');
                return $modal.open({
                    templateUrl: 'app/partials/new-player-modal.tpl.html',
                    backdrop: 'static',
                    scope: scope
                });
            },
            success: function(params) {
                $rootScope.$broadcast('modal-closed');
                var newUser = new User.resource({name: params[0], email: params[1], department: params[2]});
                newUser.$save(function(u, headers) {
                    User.refreshUsers();
                    $location.path('players/'+u.id);
                });
            },
            error: function(error) {
                $rootScope.$broadcast('modal-closed');
            }
        }
    };
}]);
