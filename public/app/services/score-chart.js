digiFoosballServices.factory('scoreChart', function() {
    var chartType = 'line';
    var config = {
        labels: false,
        title : "",
        legend : {
            display: false,
            position:'right'
        }
    };
    var data = [];

    var buildDataPoints = function(points) {
        var score_history = points.split(",");
        var home_score = 0;
        var away_score = 0;
        var data_points = [{x:"0",y:[0,0]}];

        for(var i = 0; i <= score_history.length; i++) {
            if (score_history[i] == 'home') {
                home_score += 1;
            } else if(score_history[i] == 'away') {
                away_score += 1;
            }

            data_points.push({x: (i+1).toString(), y: [home_score,away_score]});
        }

        return data_points;
    };

    var buildChartConfig = function(dataPoints,playerHomeName,playerAwayName) {
        chartType = 'line';
        config = {
            labels: false,
            title : "",
            legend : {
                display: false,
                position:'right'
            },
            lineCurveType: 'basis',
            colors: ['red','black']
        };
        data = {
            series: [playerHomeName, playerAwayName],
            data : buildDataPoints(dataPoints)
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
        rebuildChartConfig: function(dataPoints,playerHomeName,playerAwayName) {
            buildChartConfig(dataPoints,playerHomeName,playerAwayName);
        }
    };
});
