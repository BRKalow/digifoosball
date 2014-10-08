'use strict';

/* Controllers */

var digiFoosballControllers = angular.module('digiFoosballControllers', []);

digiFoosballControllers.controller('MainCtrl', function($scope, $cookieStore, $modal, $location, User, Game, Alert, Stream, Modals) {
    $scope.title = "Dashboard";
    $scope.$on('change-title', function(event, args) {
        $scope.title = args.title;
    });

    $scope.$on('users-refreshed', function(event, args) {
        $scope.users = User.allUsers();
    });
    $scope.$on('games-refreshed', function(event, args) {
        $scope.games = Game.allGames();
    });

    $scope.gameGoingOn = Game.activeGames();
    $scope.$on('active-games-refreshed', function(event, args) {
        $scope.gameGoingOn = Game.activeGames();
    });

    $scope.loading = false;
    $scope.$on('$routeChangeStart', function(scope, next, current) {
        $scope.loading = true;
    });
    $scope.$on('$routeChangeSuccess', function(scope, next, current) {
        setTimeout(function() { $scope.$apply(function() { $scope.loading = false; }); }, 400);
    });

    /**
    * Stream
    */
    Stream.onmessage(function(data) {
        if(data.id) {
            $scope.$broadcast('game-push-received', { receivedGame: data });
            if(data.finished == 1) {
                Game.refreshActiveGames();
            }
            Game.refreshGames();
            User.refreshUsers();
        } else if(data.msg) {
            Alert.setAlert(data.msg);
        }
    });

    /**
    * Alerts
    */
    $scope.alerts = Alert.getAlert();
    $scope.closeAlert = function() { Alert.closeAlert(0); };

    /**
    * Modals
    */
    $scope.users = User.allUsers();
    $scope.hasModalOpen = false;
    $scope.$on('modal-closed', function() {
        $scope.hasModalOpen = false;
    });
    $scope.$on('modal-opened', function() {
        $scope.hasModalOpen = true;
    });
    $scope.newGameModal = function() {
        $scope.leagueGame = true;
        $scope.manualGame = true;
        var modalInstance = Modals.newGame.create($scope);

        modalInstance.result.then(
            function(values) { Modals.newGame.success(values); },
            function(error) { Modals.newGame.error(error); }
        );
    };

    $scope.newPlayerModal = function() {
        var modalInstance = Modals.newPlayer.create($scope);

        modalInstance.result.then(
            function(values) { Modals.newPlayer.success(values); },
            function(error) { Modals.newPlayer.error(error); }
        );
    };

    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function() { return window.innerWidth; };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if(newValue >= mobileView) {
            if(angular.isDefined($cookieStore.get('toggle'))) {
                if($cookieStore.get('toggle') === false) {
                    $scope.toggle = false;
                } else {
                    $scope.toggle = true;
                }
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = ! $scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() { $scope.$apply(); };
});

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

digiFoosballControllers.controller('PlayerListCtrl', function($scope) {
    $scope.$emit('change-title', {title: 'Players'});
    $scope.$on('users-refreshed', function(event, args) {
        $scope.users = User.allUsers();
    });
});

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

digiFoosballControllers.controller('GameListCtrl', function($scope, Game) {
    $scope.$emit('change-title', {title: 'Games'});
    $scope.games = Game.allGames();
    $scope.$on('games-refreshed', function(event, args) {
        $scope.games = Game.allGames();
    });
});

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
