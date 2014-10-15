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
