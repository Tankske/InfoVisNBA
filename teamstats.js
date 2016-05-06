function drawTs(data, team, year, div, x, y, width, height) {

    data = data.filter(function(d) { return d.year != 1984; });

    d3.selectAll(".smallmultiple").remove();

    var nRows = 2;
    var nColumns = 4;

    var margin = { top: 25, right: 4, bottom: 15, left: 31};

    var singleWidth = width / nColumns - margin.left - margin.right;
    var singleHeight = height / nRows - margin.top - margin.bottom;


    var srsScale = d3.scale.linear()
        .range([singleHeight, 0])
        .domain([-15,15]);

    var rankScale = d3.scale.linear()
        .range([singleHeight, 0])
        .domain([16,1]);

    var poRankScale = d3.scale.linear()
        .range([singleHeight, 0])
        .domain([6,1]);

    var ageScale = d3.scale.linear()
        .range([singleHeight, 0])
        .domain([20, 35]);

    var audienceScale = d3.scale.linear()
        .range([singleHeight, 0])
        .domain([0, 1000000]);

    var fgScale = d3.scale.linear()
        .range([singleHeight, 0])
        .domain([0, 1]);

    var pointScale = d3.scale.linear()
        .range([singleHeight, 0])
        .domain([60, 140]);

    var ratingScale = d3.scale.linear()
        .range([singleHeight, 0])
        .domain([95, 125]);

    var totalPerScaler = d3.scale.linear()
        .range([singleHeight, 0])
        .domain([100, 300]);

    var bases = [//{ name: 'Field goal %', dataSelector: function(d) {return d.team.info['FG%'];}, scaler: fgScale, type: "line"}
            { name: 'Total PER', dataSelector: function(d) {return d.team.totalper; }, scaler: totalPerScaler, type: "line", format: d3.format(".0f")}
            ,{ name: 'League Rank', dataSelector: function(d) {return d.team.leaguerank; }, scaler: rankScale, type: "line", format: d3.format("d")}
            ,{ name: 'Playoff Rank', dataSelector: function(d) {if (d.team.playoffrank != undefined) {return d.team.playoffrank;} else { return 6;} }, scaler: poRankScale, type: "line", format: d3.format("d")}
            ,{ name: 'Average Age', dataSelector: function(d) {return d.team.misc.Age;}, scaler: ageScale, type: "line", format: d3.format(".1f")}
            ,{ name: 'Audience', dataSelector: function(d) {return d.team.misc.Attendance;}, scaler: audienceScale, type: "area", format: d3.format(".3sr")}
            ,{ name: 'SRS', dataSelector : function(d) { return d.team.srs; }, scaler: srsScale, type: "area", format: d3.format(".2f")}
            //,{ name: 'Points/Game', dataSelector: function(d) {return d.team.info['PTS/G'];}, scaler: pointScale, type: "area"}
            //,{ name: 'Opponent Points/Game', dataSelector: function(d) {return d.team.opponent['PTS/G'];}, scaler: pointScale, type: "area"}
            ,{ name: 'Offensive Rating', dataSelector: function(d) {return d.team.misc.ORtg;}, scaler: ratingScale, type: "area", format: d3.format(".0f")}
            ,{ name: 'Defensive Rating', dataSelector: function(d) {return d.team.misc.DRtg;}, scaler: ratingScale, type: "area", format: d3.format(".0f")}
            ];

    //var color = d3.scale.category10();
    var color = function (d) { return "steelblue"; }

    var x = d3.scale.linear()
    .range([0, singleWidth])
        .domain([1985,2015]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(3)
        .tickFormat(d3.format("d"))
        .orient("bottom");

    function makeLine(b) {
        return d3.svg.area()
                .x(function(d) { return x(d.year); })
                .y0(function(d) { return singleHeight; })
                .y1(function(d) { return b.scaler(b.dataSelector(d)); });
    }

    filteredData = data.map(function (d) { 
            var year = d.year; 
            var thisTeam = d.teams.find(function (d) { return d.team === team; }); 
            return {year: year, team: thisTeam}; 
    }).filter(function(d) {
        return d.team != undefined;
    });


    var realsvg = div.selectAll("svg")
                    .data(bases)
                    .enter()
                        //.append("div")
                        //.attr("class", "tooltip-right")
                        //.attr("data-tooltip", "hey there")
                        //.attr("style", "width: " + (singleWidth + margin.left + margin.right) + "px; height: " + (singleHeight + margin.top + margin.bottom) + "px; display: inline")
                            .append("svg")
                            .attr("width", singleWidth + margin.left + margin.right)
                            .attr("height", singleHeight + margin.top + margin.bottom)
                            .attr("id", function(d, e) { return "sm" + e; })
                            .attr("class", "smallmultiple tooltip-top");

    realsvg.append("data-tooltip") .text("hey there");
    var svg = realsvg
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("path")
        .datum(filteredData)
        .attr("class", function(d, e) { return bases[e].type; })
        .attr("fill", function(d, e) {return color(e);})
        .attr("stroke", function(d, e) {return color(e);})
        .attr("d", function(d ,e) { return makeLine(bases[e])(d); });

    realsvg.append("text")
        .attr("x", margin.left + 5)
        .attr("y", 20)
        .attr("text-anchor", "left")
        .attr("class", "tooltip-top")
        .attr("data-tooltip", "tool")
        .text(function(d) { return d.name; });
    
    svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (singleHeight - 1) + ")")
          .call(xAxis);


    div.selectAll("svg")
        .call(function (allSvgs) {
            allSvgs[0].forEach(function (oneSvg) {
                var scaler = bases[oneSvg.id.substring(2)].scaler;
                var format = bases[oneSvg.id.substring(2)].format;
                d3.select("#" + oneSvg.id)
                    .select("g")
                    .append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(0, 0)")
                        .call(d3.svg.axis()
                                .scale(scaler)
                                .ticks(3)
                                .tickFormat(format)
                                .orient("left"));
            });
        });


    svg.append("line")
        .attr("class", "curYearLine");

    realsvg.append("text")
        .attr("class", "curYearVal")
        .attr("text-anchor", "right")
        .attr("x", singleWidth - margin.right)
        .attr("y", 20);

    //svg.append("text")
        //.attr("class", "curYearName")
        //.attr("text-anchor", "middle");

    var highlightYear = year;

    //svg.on("mouseleave", function() {
        //highlightYear = year;
        //fixcyline();
        //drawTeamChange(year);
        //updateTeamInfo(data.find(function (d) { return d.year == highlightYear; }).teams.find(function (d) {return d.team === window.team.team;}), highlightYear);
    //});

    //realsvg.on("mousemove", function() {
         //highlightYear = Math.round(x.invert(d3.mouse(this)[0] - margin.left));
         //fixcyline();
         //drawTeamChange(highlightYear);
        //updateTeamInfo(data.find(function (d) { return d.year == highlightYear; }).teams.find(function (d) {return d.team === window.team.team;}), highlightYear);
    //});

    realsvg.on("click", function() {
         window.year = Math.round(x.invert(d3.mouse(this)[0] - margin.left));
         highlightYear = window.year;
         window.team = data.find(function (d) { return d.year == highlightYear; }).teams.find(function (d) {return d.team === window.team.team;})
         $("#year").val(window.year);
         $("#yearSlider").text(window.year);
         updateTeamInfo(window.team, highlightYear);
         drawAll();
    });

    function fixcyline() {
        d3.selectAll(".curYearLine")
            .attr("x1", x(highlightYear))
            .attr("y1", singleHeight)
            .attr("x2", x(highlightYear))
            .attr("y2", function(d) {return d.scaler(d.dataSelector(filteredData.find(function(d) { return d.year == highlightYear; })));});

        d3.selectAll(".curYearVal")
            //.attr("x", x(highlightYear))
            //.attr("y", function(d) { return d.scaler(d.dataSelector(filteredData.find(function(d) { return d.year == highlightYear; })));})
            .text(function(d) { return d.format(d.dataSelector(filteredData.find(function(d) { return d.year == highlightYear; })));});

        //d3.selectAll(".curYearName")
            //.attr("x", x(highlightYear))
            //.attr("y", singleHeight - 10)
            //.text(highlightYear);
    }


    fixcyline();
} 
