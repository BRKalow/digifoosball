'use strict';

/* Controllers */

var digiFoosballControllers = angular.module('digiFoosballControllers', []);

digiFoosballControllers.controller('MainCtrl', function($scope, $cookieStore, $modal, User) {
    $scope.$parent.title = "Dashboard";
    /**
    * EventStream related declarations
    */
    $scope.msg = null;

    var handleReceivePush = function (msg) {
        $scope.$apply(function() {
            $scope.msg = JSON.parse(msg.data);
        });
    };

    var source = new EventSource('/connect');
    source.addEventListener('message', handleReceivePush, false);

    /**
    * Modals
    */
    $scope.users = User.query();
    $scope.hasModalOpen = false;
    $scope.newGameModal = function() {

        $scope.hasModalOpen = true;

        var modalInstance = $modal.open({
            templateUrl: 'app/partials/new-game-modal.tpl.html',
            backdrop: 'static',
            scope: $scope
        });

        modalInstance.result.then(function() {
            $scope.hasModalOpen = false;
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

        modalInstance.result.then(function() {
            $scope.hasModalOpen = false;
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

    $scope.users = User.query();
    $scope.games = Game.query();
});

digiFoosballControllers.controller('PlayerListCtrl', function($scope) {
    $scope.$parent.title = "Players";
});

digiFoosballControllers.controller('PlayerCtrl', function($scope, $routeParams, User) {
    $scope.$parent.title = "Player";
    $scope.user = User.get({userId:$routeParams.userId});
});

digiFoosballControllers.controller('GameListCtrl', function($scope) {
    $scope.$parent.title = "Games";
});

digiFoosballControllers.controller('GameCtrl', function($scope, $routeParams, Game) {
    $scope.$parent.title = "Game";
    $scope.game = Game.get({gameId:$routeParams.gameId});

    /**
    * Construct score history graph
    */
    var buildDataPoints = function(points) {
        var score_history = points.split(",");
        var home_score = 0;
        var away_score = 0;
        var data_points = [{x:"0",y:[0,0]}];

        for(var i = 1; i <= score_history.length; i++) {
            if (score_history[i-1] == 'home') {
                home_score += 1;
            } else {
                away_score += 1;
            }

            data_points.push({x: i.toString(), y: [home_score,away_score]})
        }

        return data_points;
    }

    $scope.chartType = 'line';
    $scope.config = {
        labels: false,
        title : "",
        legend : {
            display: false,
            position:'right'
        }
    }

    $scope.game.$promise.then(function() {
        $scope.data = {
            series: [$scope.game.player_home.name, $scope.game.player_away.name],
            data : buildDataPoints($scope.game.score_history)
        }
    })
});
