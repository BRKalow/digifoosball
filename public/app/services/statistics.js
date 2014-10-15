digiFoosballServices.service('Statistics', function($http,$q) {
    var Statistics = {
      poll: function() {
        var deferred = $q.defer();
        $http.get('/api/statistics').then(function (response) {
          deferred.resolve(response.data);
        });
        return deferred.promise;
      }
    };
    return Statistics;
});
