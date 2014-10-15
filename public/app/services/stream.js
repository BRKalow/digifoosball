digiFoosballServices.factory('Stream', ['$rootScope', function($rootScope) {
    var source = new EventSource('/connect');

    source.onmessage = function(event) {
        var parsedData = JSON.parse(event.data);

        $rootScope.$broadcast('push-received', { message: parsedData });

        if (service.handlers.onmessage) {
            $rootScope.$apply(function() {
                service.handlers.onmessage.apply(source,[parsedData]);
            });
        }
    };

    var service = {
        handlers: {},
        onmessage: function(callback) {
          this.handlers.onmessage = callback;
        }
    };

    return service;
}]);
