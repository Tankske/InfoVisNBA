function drawTs(data, team, year, div, x, y, width, height) {

    d3.selectAll(".smallmultiple").remove();

    var nRows = 2;
    var nColumns = 4;

    var margin = { top: 9, right: 10, bottom: 1, left: 10};

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

    var bases = [{ name: 'Field goal %', dataSelector: function(d) {return d.team.info['FG%'];}, scaler: fgScale, type: "line"}
            ,{ name: 'League Rank', dataSelector: function(d) {return d.team.leaguerank; }, scaler: rankScale, type: "line"}
            ,{ name: 'Playoff Rank', dataSelector: function(d) {if (d.team.playoffrank != undefined) {return d.team.playoffrank;} else { return 6;} }, scaler: poRankScale, type: "line"}
            ,{ name: 'Average Age', dataSelector: function(d) {return d.team.misc.Age;}, scaler: ageScale, type: "line"}
            ,{ name: 'Audience', dataSelector: function(d) {return d.team.misc.Attendance;}, scaler: audienceScale, type: "area"}
            ,{ name: 'SRS', dataSelector : function(d) { return d.team.srs; }, scaler: srsScale, type: "area"}
            ,{ name: 'Points/Game', dataSelector: function(d) {return d.team.info['PTS/G'];}, scaler: pointScale, type: "area"}
            ,{ name: 'Opponent Points/Game', dataSelector: function(d) {return d.team.opponent['PTS/G'];}, scaler: pointScale, type: "area"}
            ];

    var color = d3.scale.category10();

    var x = d3.scale.linear()
    .range([0, singleWidth])
        .domain([1984,2015]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(3)
        .tickFormat(d3.format("d"))
        .orient("top");

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
                    .enter().append("svg")
                        .attr("width", singleWidth + margin.left + margin.right)
                        .attr("height", singleHeight + margin.top + margin.bottom)
                        .attr("id", function(d, e) { return "sm" + e; })
                        .attr("class", "smallmultiple");

    var svg = realsvg
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("path")
        .datum(filteredData)
        .attr("class", function(d, e) { return bases[e].type; })
        .attr("fill", function(d, e) {return color(e);})
        .attr("stroke", function(d, e) {return color(e);})
        .attr("d", function(d ,e) { return makeLine(bases[e])(d); });

    svg.append("text")
        .attr("x", (singleWidth/2))
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; });
    
    svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (singleHeight - 1) + ")")
          .call(xAxis);


    div.selectAll("svg")
        .call(function (allSvgs) {
            allSvgs[0].forEach(function (oneSvg) {
                var scaler = bases[oneSvg.id.substring(2)].scaler;
                d3.select("#" + oneSvg.id)
                    .select("g")
                    .append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(0, 0)")
                        .call(d3.svg.axis()
                                .scale(scaler)
                                .ticks(3)
                                .orient("right"));
            });
        });


    svg.append("line")
        .attr("class", "curYearLine");

    svg.append("text")
        .attr("class", "curYearVal")
        .attr("text-anchor", "middle");

    svg.append("text")
        .attr("class", "curYearName")
        .attr("text-anchor", "middle");

    var highlightYear = year;

    svg.on("mouseleave", function() {
        highlightYear = year;
        fixcyline();
        drawTeamChange(year);
        updateTeamInfo(data.find(function (d) { return d.year == highlightYear; }).teams.find(function (d) {return d.team === window.team.team;}), highlightYear);
    });

    //realsvg.on("mousemove", function() {
         //highlightYear = Math.round(x.invert(d3.mouse(this)[0] - margin.left));
         //fixcyline();
         //drawTeamChange(highlightYear);
        //updateTeamInfo(data.find(function (d) { return d.year == highlightYear; }).teams.find(function (d) {return d.team === window.team.team;}), highlightYear);
    //});

    realsvg.on("click", function() {
         window.year = Math.round(x.invert(d3.mouse(this)[0] - margin.left));
         $("#year").val(window.year);
         $("#yearSlider").text(window.year);
         drawAll();
    });

    function fixcyline() {
        d3.selectAll(".curYearLine")
            .attr("x1", x(highlightYear))
            .attr("y1", singleHeight)
            .attr("x2", x(highlightYear))
            .attr("y2", function(d) {return d.scaler(d.dataSelector(filteredData.find(function(d) { return d.year == highlightYear; })));});

        d3.selectAll(".curYearVal")
            .attr("x", x(highlightYear))
            .attr("y", function(d) { return d.scaler(d.dataSelector(filteredData.find(function(d) { return d.year == highlightYear; })));})
            .text(function(d) { return d.dataSelector(filteredData.find(function(d) { return d.year == highlightYear; }));});

        d3.selectAll(".curYearName")
            .attr("x", x(highlightYear))
            .attr("y", singleHeight - 10)
            .text(highlightYear);
    }


    fixcyline();
} 
