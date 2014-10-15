app.directive('userListIndex', function() {
  return {
    restrict: 'AE',
    scope: {users: '=for'},
    templateUrl: 'app/partials/user-list-index.tpl.html',
    replace: true
  };
});
