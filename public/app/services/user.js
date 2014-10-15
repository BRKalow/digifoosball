digiFoosballServices.factory('User', function($resource, $rootScope) {
    var users = [];
    var resource = $resource('/api/user/:userId', {userId:'@id'});
    return {
        resource: resource,
        allUsers: function() {
            if(users.length == 0) {
                users = resource.query();
            }
            return users;
        },
        refreshUsers: function() {
          users = resource.query();
          $rootScope.$broadcast('users-refreshed', users);
        },
        totalGoals: function(user) {
            return user.goals_scored + user.goals_given;
        },
        percentGoalsScored: function(user) {
            return (100 * user.goals_scored / this.totalGoals(user)).toFixed(2);
        },
        percentGoalsGiven: function(user) {
            return (100 * user.goals_given / this.totalGoals(user)).toFixed(2);
        },
        percentWins: function(user) {
            return (100 * user.wins / user.games_played).toFixed(2);
        },
        percentLosses: function(user) {
            return (100 * user.losses / user.games_played).toFixed(2);
        }
    };
});
