app.directive('gameClock', function($timeout) {
  return {
    restrict: 'AE',
    template: '<div class="game-clock">{{ difference() }}</div>',
    link: function(scope, elem, attrs) {
      scope.startTime = new Date(attrs.start).valueOf();
      scope.currentTime = new Date().valueOf();
      scope.difference = function() { 
        return Math.round((scope.currentTime - scope.startTime) / 10) / 100; 
      };
      scope.updateTime = function() {
        $timeout(function() {
          scope.trigger = new Date();
          scope.updateTime();
        }, 100);
      };
      scope.updateTime();
      scope.$watch(function() { return (new Date()).valueOf(); }, function(newVal) {
        scope.currentTime = newVal;
      });
    }
  };
});
