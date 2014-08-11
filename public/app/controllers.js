'use strict';

/* Controllers */

var digiFoosballControllers = angular.module('digiFoosballControllers', []);

digiFoosballControllers.controller('MainCtrl', function($scope, $cookieStore, Statistics) {
    $scope.$parent.title = "Dashboard";
    /**
    * EventStream related declarations
    */
    $scope.msg = null;

    var handleReceivePush = function (msg) {
        $scope.$apply(function() {
            $scope.msg = JSON.parse(msg.data);
        });
    }
    
    var source = new EventSource('/connect');
    source.addEventListener('message', handleReceivePush, false);

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

digiFoosballControllers.controller('PlayerListCtrl', function($scope) { 
  $scope.$parent.title = "Players";
});
digiFoosballControllers.controller('PlayerCtrl', function($scope) {
  $scope.$parent.title = "Player";
});
digiFoosballControllers.controller('GameListCtrl', function($scope) {
  $scope.$parent.title = "Games";
});
digiFoosballControllers.controller('GameCtrl', function($scope) {
  $scope.$parent.title = "Game";
});
