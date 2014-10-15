digiFoosballServices.factory('rankingChart', function() {
    var chartType = 'line';
    var config = {
        labels: false,
        title : "",
        legend : {
            display: false,
            position:'right'
        },
        lineLegend: "traditional"
    };
    var data = [];

    var buildDataPoints = function(player) {
        var dataPoints = [];
        var limit = (player.games.length < 10) ? player.games.length : 10;
        var currentRating = player.rating;
        var games = player.games.sort(function(a, b){ return a.id - b.id });

        if(games.length == 0) {
            dataPoints.unshift({x: "0", y: [0]});
            return dataPoints;
        }

        for(var i = 1; i <= limit; i++) {
            var game = games[games.length - i];
            var ratingChange = (game.player_home_id == player.id) ? game.home_rating_change:game.away_rating_change;
            if(game.player_home_id == player.id && game.score_away == 5 ||
               game.player_away_id == player.id && game.score_home == 5) {
                ratingChange *= -1;
            }
            dataPoints.unshift({x: (limit+1-i).toString(), y: [currentRating]});
            currentRating -= ratingChange;
        }

        return dataPoints;
    };

    var buildChartConfig = function(player) {
        chartType = 'line';
        config = {
            labels: false,
            tooltips: false,
            title : "",
            legend : {
                display: false,
                position:'right'
            },
            lineCurveType: 'basis',
            colors: ['green']
        };
        data = {
            series: [''],
            data : buildDataPoints(player)
        };
    };

    return {
        getChart: function() {
            return {
                chartType: chartType,
                config: config,
                data: data
            };
        },
        rebuildChartConfig: function(player) {
            buildChartConfig(player);
        }
    };
});
