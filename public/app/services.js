'use strict';

/* Services */

var digiFoosballServices = angular.module('digiFoosballServices', ['plRestmod']);

digiFoosballServices.factory('User', function($restmod) {
  return $restmod.model('/api/user');
});

digiFoosballServices.factory('Game', function($restmod) {
  return $restmod.model('/api/games');
});
