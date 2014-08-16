'use strict';

/* Controllers */

var digiFoosballControllers = angular.module('digiFoosballControllers', []);

digiFoosballControllers.controller('MainCtrl', function($scope, $cookieStore, $modal, $location, User, Game, Alert, Stream) {
    $scope.$parent.title = "Dashboard";

    $scope.gameGoingOn = Game.resource.query({finished:'0'});

    /**
    * Stream
    */
    Stream.onmessage(function(data) {
        if(data.id) {
            $scope.$broadcast('game-push-received', { receivedGame: data });
            Game.refreshGames();
            User.refreshUsers();
            if(data.finished == 0) {
                $scope.gameGoingOn[0] = data;
            } else {
                $scope.gameGoingOn[0] = null;
            }
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
    $scope.newGameModal = function() {

        $scope.hasModalOpen = true;

        var modalInstance = $modal.open({
            templateUrl: 'app/partials/new-game-modal.tpl.html',
            backdrop: 'static',
            scope: $scope
        });

        modalInstance.result.then(function(teams) {
            $scope.hasModalOpen = false;
            if(teams[0].id == teams[1].id) {
                Alert.setAlert('You can\'t create a game with one person!');
                return;
            }
            var newGame = new Game.resource({player_home_id:teams[0].id, player_away_id:teams[1].id});
            newGame.$save(function(g, headers) {
                Game.refreshGames();
                $scope.gameGoingOn[0] = g;
                $location.path('games/'+g.id);
            });
        }, function(error) {
            $scope.hasModalOpen = false;
        });
    };

    $scope.newPlayerModal = function() {

        $scope.hasModalOpen = true;

        var modalInstance = $modal.open({
            templateUrl: 'app/partials/new-player-modal.tpl.html',
            backdrop: 'static',
            scope: $scope
        });

        modalInstance.result.then(function(params) {
            $scope.hasModalOpen = false;
            var newUser = new User.resource({name: params[0], email: params[1], department: params[2]});
            newUser.$save(function(u, headers) {
                User.refreshUsers();
                $location.path('players/'+u.id);
            });
        }, function(error) {
            $scope.hasModalOpen = false;
        });
    };

    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function() { return window.innerWidth; };

    $scope.$watch($scope.getWidth, function(newValue, oldValue)
    {
        if(newValue >= mobileView)
        {
            if(angular.isDefined($cookieStore.get('toggle')))
            {
                if($cookieStore.get('toggle') === false)
                    $scope.toggle = false;

                else
                    $scope.toggle = true;
            }
            else
            {
                $scope.toggle = true;
            }
        }
        else
        {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function()
    {
        $scope.toggle = ! $scope.toggle;

        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() { $scope.$apply(); };
});

digiFoosballControllers.controller('IndexCtrl', function($scope, Statistics, User, Game) {
    $scope.$parent.title = 'Dashboard';
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
    var statsTimer = setInterval(updateStats, 10000);

    $scope.users = User.allUsers();
    $scope.games = Game.allGames();
});

digiFoosballControllers.controller('PlayerListCtrl', function($scope) {
    $scope.$parent.title = "Players";
});

digiFoosballControllers.controller('PlayerCtrl', function($scope, $routeParams, User) {
    $scope.$parent.title = "Player";
    $scope.user = User.resource.get({userId:$routeParams.userId});

    $scope.user.$promise.then(function() {
        $scope.totalGoals = $scope.user.goals_given + $scope.user.goals_scored;
        $scope.percent_scored = (100 * $scope.user.goals_scored / $scope.totalGoals).toFixed(2);
        $scope.percent_given = (100 * $scope.user.goals_given / $scope.totalGoals).toFixed(2);
    });
});

digiFoosballControllers.controller('GameListCtrl', function($scope, Game) {
    $scope.$parent.title = "Games";
    $scope.games = Game.allGames();
});

digiFoosballControllers.controller('GameCtrl', function($scope, $routeParams, Game) {
    $scope.$parent.title = "Game";
    $scope.game = Game.resource.get({gameId:$routeParams.gameId});

    /**
    * EventStream related declarations
    */
    $scope.$on('game-push-received', function(event, args) {
        var receivedGame = args.receivedGame;
        if(receivedGame.id == $routeParams.gameId) {
            $scope.game = receivedGame;
            buildChartConfig();
        }
    });

    /**
    * Construct score history graph
    */
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

    var buildChartConfig = function() {
        $scope.chartType = 'line';
        $scope.config = {
            labels: false,
            title : "",
            legend : {
                display: false,
                position:'right'
            }
        };

        $scope.data = {
            series: [$scope.game.player_home.name, $scope.game.player_away.name],
            data : buildDataPoints($scope.game.score_history)
        };
    };

    $scope.chartType = 'line';
    $scope.config = {
        labels: false,
        title : "",
        legend : {
            display: false,
            position:'right'
        }
    };

    $scope.game.$promise.then(function() {
        buildChartConfig();
    });
});
