digiFoosballServices.factory('Alert', function() {
    var alert = [];

    return {
        setAlert: function(msg) {
          alert[0] = {type: 'info', msg: msg};
        },
        getAlert: function() {
          return alert;
        },
        closeAlert: function(index) {
          alert.splice(index, 1);
        }
    };
});
