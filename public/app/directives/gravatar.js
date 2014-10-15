app.directive('gravatar', function() {
  return {
    restrict: 'AE',
    scope: {hash: '=for', gClass: '='},
    repalce: true,
    template: '<img ng-src="http://www.gravatar.com/avatar/{{ hash }}" alt="" class="gravatar {{ gClass }}" />'
  };
});
