app.directive('userStatBar', function() {
  return {
    restrict: 'AE',
    scope: {title: '=', titlePositive: '=', titleNegative: '=',
            positiveValue: '=', negativeValue: '=', maxValue: '=',
            percentPositive: '=', percentNegative: '='},
    replace: true,
    templateUrl: 'app/partials/user-stat-bars.tpl.html'
  };
});
