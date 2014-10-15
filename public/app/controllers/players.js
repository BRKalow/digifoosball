digiFoosballControllers.controller('PlayerListCtrl', function($scope) {
    $scope.$emit('change-title', {title: 'Players'});
    $scope.$on('users-refreshed', function(event, args) {
        $scope.users = User.allUsers();
    });
});
