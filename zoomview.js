
var ShirtColors = {
    torontoraptors : {shirt: "#ff0000", edge:  "#000000"},
    bostonceltics : {shirt: "#008000", edge: "#ffffff"},
    brooklynnets : {shirt: "#000000", edge: "#ffffff"},
    philadelphia76ers : {shirt: "#ff0000", edge: "#0000ff"},
    newyorkknicks  : {shirt: "#0000ff;", edge: "#ff4500"},
    clevelandcavaliers : {shirt: "#8b0000", edge: "#ffd700"},
    chicagobulls : {shirt: "#ff0000", edge: "#000000"},
    milwaukeebucks : {shirt: "#006400", edge: "#ff0000"},
    indianapacers : {shirt: "#000080", edge: "#ffd700"},
    detroitpistons : {shirt: "#0000ff", edge: "##ff0000"},
    atlantahawks : {shirt: "#000080", edge: "#ff0000"},
    washingtonwizards : {shirt: "#ff0000", edge: "#000080"},
    miamiheat : {shirt: "#000000", edge: "#8b0000"},
    charlottehornets : {shirt: "#800080", edge: "#008080"},
    orlandomagic : {shirt: "#0000ff", edge: "#000000"},
    portlandtrailblazers : {shirt: "#000000", edge: "#ff0000"},
    oklahomacitythunder : {shirt: "#009acd", edge: "#00008b"},
    utahjazz : {shirt: "#000080", edge: "#006400"},
    denvernuggets : {shirt: "#6ca6cd", edge: "#000080"},
    minnesotatimberwolves : {shirt: "#00688b", edge: "#000000"},
    goldenstatewarriors : {shirt: "#0000ff", edge: "#ffd700"},
    losangelesclippers : {shirt: "#ff0000", edge: "#0000ff"},
    phoenixsuns : {shirt: "#800080", edge: "#ff8c00"},
    sacramentokings : {shirt: "#800080", edge: "#000000"},
    losangeleslakers : {shirt: "#800080", edge: "#ffd700"},
    houstonrockets : {shirt: "#ff0000", edge: "#ffffff"},
    sanantoniospurs : {shirt: "#000000", edge: "#c0c0c0"},
    memphisgrizzlies : {shirt: "#191970", edge: "#6ca6cd"},
    dallasmavericks : {shirt: "#000080", edge: "#0000ff"},
    neworleanspelicans : {shirt: "#00008b", edge: "#ffd700"},
    buffalobraves : {shirt: "6ca6cd", edge: "000000"},
    baltimorebullets : {shirt: "0000ff", edge: "ff0000"},
    cincinnatiroyals : {shirt: "0000ff", edge: "ffffff"},
    seattlesupersonics : {shirt: "006400", edge: "ffd700"},
    kansascityomahakings : {shirt: "0000ff", edge: "ff0000"},
    capitalbullets : {shirt: "0000ff", edge: "ff0000"},
    washingtonbullets : {shirt: "ff0000", edge: "0000ff"},
    neworleansjazz : {shirt: "800080", edge: "ffd700"},
    kansascitykings : {shirt: "0000ff", edge: "ff0000"},
    newyorknets : {shirt: "0000ff", edge: "ff0000"},
    newjerseynets : {shirt: "000080", edge: "ff0000"},
    sandiegoclippers : {shirt: "0000ff", edge: "ff0000"},
    vancouvergrizzlies : {shirt: "40e0d0", edge: "000000"},
    neworleanshornets : {shirt: "009acd", edge: "551a8b"},
    neworleansoklahomacityhornets : {shirt: "009acd", edge: "551a8b"},
    charlottebobcats : {shirt: "000080", edge: "add8e6"}
}

var margin = {top: 20, right: 20, bottom: 20, left: 20};

function drawTransfers(inData, teamWanted, yearWanted, svg, xpos, ypos, w, h, arrowVariable, shirtScaler) {

    d3.select(".zoomchart").remove();

    var previousPlayers = [],
        currentPlayers = [],
        arrayPlayers = [],
        teamSRS = 0;

    var minMaxSRSAllYears = minMaxSRS(inData);
    var minMaxSRSThisYear = minMaxSRSYear(inData, yearWanted);
    var minMaxSRSTeam = minMaxTeamSRS(inData, teamWanted);

    var maxWidthInOutPart = w*1/2 - margin.left/ 2;

    var maxPossibleWidthCircle = w*1/3 - margin.left;
    var maxRad = getRadiusScaledCircle(minMaxSRSAllYears[1], maxPossibleWidthCircle, h, minMaxSRSAllYears[0], minMaxSRSAllYears[1]);
    var maxWidthCircle = 2*maxRad;

    var maxWidthStayedPart = w - maxWidthInOutPart - maxWidthCircle - 2*margin.left;

    var maxHeightStayedPart = h;

    var arrowRectHorizontalHeight = h/8;
    var arrowRectVerticalWidth = maxWidthStayedPart/6;

    inData.forEach(function (yearData) {
        if (yearData.year == yearWanted - 1) {
            yearData.teams.forEach(function (teamData) {
                if (teamData.team == teamWanted) {
                    previousPlayers = teamData.players;
                }
            });
        }

        if (yearData.year == yearWanted) {
            yearData.teams.forEach(function (teamData) {
                if (teamData.team == teamWanted) {
                    teamSRS = teamData.srs;
                    currentPlayers = teamData.players;
                }
            });
        }
    });

    arrayPlayers = separatePlayers(previousPlayers, currentPlayers);

    var chart = svg.append("svg")					//Append one div to the selected div in which we will construct the visualisation. This is done to separate mutliple visualisations..
        .attr("class","chart zoomchart")
        .attr("width", w)
        .attr("height", h);

    var defs = chart.append("defs");

    defs.append("path")
        .attr("d", "M 0,0 v 10 h 50 v -10 z")
        .attr("id", "transferRectHorizontal");

    defs.append("path")
        .attr("d", "M -5,0 v 50 h 10 v -50 z")
        .attr("id", "transferRectVertical");

    defs.append("path")
        .attr("d", "M 0,0 l -10,10 h 20 z")
        .attr("id", "arrowUp");

    defs.append("path")
        .attr("d", "M -10,0 h 20 l -10,10 z")
        .attr("id", "arrowDown");

    defs.append("path")
        .attr("d", "M -10,-0.5 h 20 v 1 h -20 z")
        .attr("stroke", "black")
        .attr("id", "transferVerticalZeroLine");

    defs.append("path")
        .attr("d", "M 0,-10 v 20 h 7.5 z")
        .attr("id", "arrowRight2")
        .attr("class", "arrowIn");

    defs.append("path")
        .attr("d", "M 0,20 v -20 h -7.5 z")
        .attr("id", "arrowLeft2")
        .attr("class", "arrowOut");

    var teamName = fixteamname(teamWanted);
    defs.append('pattern')
        .attr('id', function(d) { return (fixteamname(teamName)+"logo");}) // just create a unique id (id comes from the json)
        .attr('patternContentUnits', 'objectBoundingBox')
        .attr('width', 1)
        .attr('height', 1)
        .append("svg:image")
        .attr("xlink:xlink:href", function(d) { return ("./teamlogos/" + fixteamname(teamName) + ".png");})
        .attr("height", 0.8)
        .attr("width", 0.8)
        .attr("x", 0.1)
        .attr("y", 0.1)
        .attr("preserveAspectRatio", "xMidYMid meet");
		
    drawTeamCircle(teamName, yearWanted, teamSRS, minMaxSRSThisYear, minMaxSRSAllYears, chart, (xpos + w/2 + margin.left), (ypos + h/2), maxWidthCircle, h);
    drawArrows(inData, teamName, yearWanted, arrowVariable, shirtScaler, arrayPlayers, chart, w, h, maxWidthInOutPart, arrowRectHorizontalHeight, maxWidthStayedPart, maxHeightStayedPart, arrowRectVerticalWidth);
}

function drawTeamCircle(teamName, year, teamSRS, minMaxSRSYear, minMaxSRSAllYears, svg, xPos, yPos, w, h) {

    var averageSRS = 0;

    var rad = getRadiusScaledCircle(teamSRS, w, h, minMaxSRSAllYears[0], minMaxSRSAllYears[1]);
    var minRad = getRadiusScaledCircle(minMaxSRSAllYears[0], w, h, minMaxSRSAllYears[0], minMaxSRSAllYears[1]);
    var maxRad = getRadiusScaledCircle(minMaxSRSAllYears[1], w, h, minMaxSRSAllYears[0], minMaxSRSAllYears[1]);
    var yearMinRad = getRadiusScaledCircle(minMaxSRSYear[0], w, h, minMaxSRSAllYears[0], minMaxSRSAllYears[1]);
    var yearAverageRad = getRadiusScaledCircle(averageSRS, w, h, minMaxSRSAllYears[0], minMaxSRSAllYears[1]);
    var yearMaxRad = getRadiusScaledCircle(minMaxSRSYear[1], w, h, minMaxSRSAllYears[0], minMaxSRSAllYears[1]);

    var maxSRSBoolean = "visible";
    if (minMaxSRSYear[1] >= teamSRS && teamSRS >= (minMaxSRSYear[1] - 1)) {
        maxSRSBoolean = "hidden";
    }
    var teamAboveAverageSRSBoolean = "visible";
    if ((averageSRS + 1) >= teamSRS && teamSRS > averageSRS) {
        teamAboveAverageSRSBoolean = "hidden";
    }
    var AverageSRSBoolean = "visible";
    if (averageSRS >= teamSRS && teamSRS > (averageSRS - 1)) {
        AverageSRSBoolean = "hidden";
    }
    var minSRSBoolean = "visible";
    if ((minMaxSRSYear[0] + 1) >= teamSRS && teamSRS >= minMaxSRSYear[0]) {
        minSRSBoolean = "hidden";
    }

    var tipMin = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return  "Minimum SRS (" + (year-1) + "-" + year + "): <span style='color:orange'>" + minMaxSRSYear[0].toFixed(2) + "</span>";
        });

    var tipAverage = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return  "Average SRS (" + (year-1) + "-" + year + "): <span style='color:orange'>" + averageSRS + "</span>";
        });

    var tipMax = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return  "Maximum SRS (" + (year-1) + "-" + year + "): <span style='color:orange'>" + minMaxSRSYear[1].toFixed(2) + "</span>";
        });

    var tipCurr = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return  "Team SRS (" + (year-1) + "-" + year + "): <span style='color:cornflowerblue'>" + teamSRS.toFixed(2) + "</span>";
        });

    var tipSRS = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return  "<strong>SRS (Simple Rating System):</strong> <span style='color:black'>A score for a team based on the results of the teams.</span>";
        });

    svg.call(tipMin);
    svg.call(tipAverage);
    svg.call(tipMax);
    svg.call(tipCurr);
    svg.call(tipSRS);

    var highlights = svg.append("g")
        .attr("class", "highlights")
        .attr("height", height)
        .attr("width", width);




    var circles = svg.append('svg')
        .attr('class', 'circleTeam');

    //.style("fill", "green")
    //TODO als logo er ni instaat een placeholder?
    circles.append("rect")
        .attr("x", xPos)
        .attr("y", yPos - maxRad)
        .attr("width", 2*maxRad)
        .attr("height", 2*maxRad)
        .attr("fill", "white")
        .attr("fill-opacity", 0)
        .attr("stroke", "none")
        .on('mouseover', function() {
            highlights.selectAll(".highlightcircle").remove();
            highlights
                .append("rect")
                .attr("stroke", "none")
                .style("fill", "#D8D8D8")
                .attr("x", d3.select(this).attr("x"))
                .attr("y", d3.select(this).attr("y"))
                .attr("width", d3.select(this).attr("width"))
                .attr("height", d3.select(this).attr("height"))
                .attr("class", "highlightcircle");
            tipSRS.show(document.getElementById("maxYearCircle"));;
        })
        .on('mouseout', function() {
            highlights.selectAll(".highlightcircle").remove();
            tipSRS.hide();
        });


    circles.append("circle")
        .attr("class", "teambubblezoom")
        .attr("id", "maxYearCircle")
        .attr("cx", xPos + maxRad) //arrow heigth is half of the width
        .attr("cy", yPos)
        .attr("r", yearMaxRad)
        .attr("stroke", "grey")
        //.style("fill", "cornflowerblue");
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.2)
        .style("fill-opacity", 0)
        .on('mouseover', function() {
            highlights.selectAll(".highlightcircle").remove();
            highlights
                .append("circle")
                .attr("stroke", "orange")
                .style("stroke-width", 2)
                .style("fill", "white")
                .attr("r", d3.select(this).attr("r"))
                .attr("cx", d3.select(this).attr("cx"))
                .attr("cy", d3.select(this).attr("cy"))
                .attr("class", "highlightcircle");
            d3.select("#teamCircle").style("fill-opacity", 0.05);
            d3.select("#teamCircle").style("stroke-width", 1);
            d3.select("#teamCircle").style("stroke", "cornflowerblue");
            tipMax.show(document.getElementById("maxYearCircle"));;
        })
        .on('mouseout', function() {
            highlights.selectAll(".highlightcircle").remove();
            d3.select("#teamCircle").style("fill-opacity", 1);
            d3.select("#teamCircle").style("stroke-width", 2);
            d3.select("#teamCircle").style("stroke", "black");
            tipMax.hide();
        });

    if (rad > yearAverageRad) {
        circles.append("circle")
            .attr("class", "teambubblezoom")
            .attr("id", "teamCircle")
            .attr("cx", xPos + maxRad) //arrow heigth is half of the width
            .attr("cy", yPos)
            .attr("r", rad)
            .style("stroke-width", 2)
            .style("fill", function (d) {
                return ("url(#" + teamName + "logo)");
            })
            .on('mouseover', function() {
                highlights.selectAll(".highlightcircle").remove();
                highlights
                    .append("circle")
                    .attr("fill", "white")
                    .attr("r", d3.select(this).attr("r"))
                    .attr("cx", d3.select(this).attr("cx"))
                    .attr("cy", d3.select(this).attr("cy"))
                    .attr("class", "highlightcircle");
                d3.select("#teamCircle").style("fill-opacity", 0.05);
                d3.select("#teamCircle").style("stroke", "cornflowerblue");
                tipCurr.show(document.getElementById("maxYearCircle"));;
            })
            .on('mouseout', function() {
                highlights.selectAll(".highlightcircle").remove();
                d3.select("#teamCircle").style("fill-opacity", 1);
                d3.select("#teamCircle").style("stroke", "black");
                tipCurr.hide();
            });

        circles.append("circle")
            .attr("class", "teambubblezoom")
            .attr("cx", xPos + maxRad) //arrow heigth is half of the width
            .attr("cy", yPos)
            .attr("r", yearAverageRad)
            .attr("stroke", "grey")
            .style("stroke-width", 1)
            .style("stroke-opacity", 0.3)
            .style("fill-opacity", 0)
            .on('mouseover', function() {
                highlights.selectAll(".highlightcircle").remove();
                highlights
                    .append("circle")
                    .attr("stroke", "orange")
                    .style("stroke-width", 2)
                    .style("fill", "white")
                    .attr("r", d3.select(this).attr("r"))
                    .attr("cx", d3.select(this).attr("cx"))
                    .attr("cy", d3.select(this).attr("cy"))
                    .attr("class", "highlightcircle");
                d3.select("#teamCircle").style("fill-opacity", 0.05);
                d3.select("#teamCircle").style("stroke-width", 1);
                d3.select("#teamCircle").style("stroke", "cornflowerblue");
                tipAverage.show(document.getElementById("maxYearCircle"));;
            })
            .on('mouseout', function() {
                highlights.selectAll(".highlightcircle").remove();
                d3.select("#teamCircle").style("fill-opacity", 1);
                d3.select("#teamCircle").style("stroke-width", 2);
                d3.select("#teamCircle").style("stroke", "black");
                tipAverage.hide();
            });
    }

    else if (rad <= yearAverageRad) {
        circles.append("circle")
            .attr("class", "teambubblezoom")
            .attr("cx", xPos + maxRad) //arrow heigth is half of the width
            .attr("cy", yPos)
            .attr("r", yearAverageRad)
            .attr("stroke", "grey")
            .style("stroke-width", 1)
            .style("stroke-opacity", 0.3)
            .style("fill-opacity", 0)
            .on('mouseover', function() {
                highlights.selectAll(".highlightcircle").remove();
                highlights
                    .append("circle")
                    .attr("stroke", "orange")
                    .style("stroke-width", 2)
                    .style("fill", "white")
                    .attr("r", d3.select(this).attr("r"))
                    .attr("cx", d3.select(this).attr("cx"))
                    .attr("cy", d3.select(this).attr("cy"))
                    .attr("class", "highlightcircle");
                d3.select("#teamCircle").style("fill-opacity", 0.05);
                d3.select("#teamCircle").style("stroke-width", 1);
                d3.select("#teamCircle").style("stroke", "cornflowerblue");
                tipAverage.show(document.getElementById("maxYearCircle"));;
            })
            .on('mouseout', function() {
                highlights.selectAll(".highlightcircle").remove();
                d3.select("#teamCircle").style("fill-opacity", 1);
                d3.select("#teamCircle").style("stroke-width", 2);
                d3.select("#teamCircle").style("stroke", "black");
                tipAverage.hide();
            });

        circles.append("circle")
            .attr("class", "teambubblezoom")
            .attr("id", "teamCircle")
            .attr("cx", xPos + maxRad) //arrow heigth is half of the width
            .attr("cy", yPos)
            .attr("r", rad)
            .style("stroke-width", 2)
            //.style("fill", "cornflowerblue");
            .style("fill", function (d) {
                return ("url(#" + teamName + "logo)");
            })
            .on('mouseover', function() {
                highlights.selectAll(".highlightcircle").remove();
                highlights
                    .append("circle")
                    .attr("fill", "white")
                    .attr("r", d3.select(this).attr("r"))
                    .attr("cx", d3.select(this).attr("cx"))
                    .attr("cy", d3.select(this).attr("cy"))
                    .attr("class", "highlightcircle");
                d3.select("#teamCircle").style("fill-opacity", 0.05);
                d3.select("#teamCircle").style("stroke", "cornflowerblue");
                tipCurr.show(document.getElementById("maxYearCircle"));;
            })
            .on('mouseout', function() {
                highlights.selectAll(".highlightcircle").remove();
                d3.select("#teamCircle").style("fill-opacity", 1);
                d3.select("#teamCircle").style("stroke", "black");
                tipCurr.hide();
            });
    }

    circles.append("circle")
        .attr("class", "teambubblezoom")
        .attr("id", "minCircle")
        .attr("cx", xPos + maxRad) //arrow heigth is half of the width
        .attr("cy", yPos)
        .attr("r", yearMinRad)
        .attr("stroke", "grey")
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.3)
        .attr("fill-opacity", 0)
        .on('mouseover', function() {
            highlights.selectAll(".highlightcircle").remove();
            highlights
            .append("circle")
                .attr("stroke", "orange")
                .style("stroke-width", 2)
                .style("fill", "white")
                .attr("r", d3.select(this).attr("r"))
                .attr("cx", d3.select(this).attr("cx"))
                .attr("cy", d3.select(this).attr("cy"))
                .attr("class", "highlightcircle");
            d3.select("#teamCircle").style("fill-opacity", 0.05);
            d3.select("#teamCircle").style("stroke-width", 1);
            d3.select("#teamCircle").style("stroke", "cornflowerblue");
            d3.select("#teamCircleHidden").style("stroke", "white");
            tipMin.show(document.getElementById("maxYearCircle"));
        })
        .on('mouseout', function() {
            highlights.selectAll(".highlightcircle").remove();
            d3.select("#teamCircle").style("fill-opacity", 1);
            d3.select("#teamCircle").style("stroke-width", 2);
            d3.select("#teamCircle").style("stroke", "black");
            d3.select("#teamCircleHidden").style("stroke", "black");
            tipMin.hide();
        });

    var hiddenRad = 0;
    var hiddenBoolean = false;
    var teamHiddenBoolean = false;
    if (maxSRSBoolean == "hidden") {
        hiddenRad = yearMaxRad;
        hiddenBoolean = true;
    }
    else if (teamAboveAverageSRSBoolean == "hidden") {
        hiddenRad = rad;
        hiddenBoolean = true;
        teamHiddenBoolean = true;
    }
    else if (AverageSRSBoolean == "hidden") {
        hiddenRad = yearAverageRad;
        hiddenBoolean = true;
    }
    else if (minSRSBoolean == "hidden") {
        hiddenRad = yearMinRad;
        hiddenBoolean = true;
        teamHiddenBoolean = true;
    }

    if (hiddenBoolean) {
        if (teamHiddenBoolean) {
            circles.append("path")
                .attr("class", "teambubblezoom")
                .attr("id", "teamCircleHidden")
                .attr("d", "M " + (xPos + maxRad - hiddenRad) + "," + yPos + " A " + hiddenRad + "," + hiddenRad + " 0 1,0 " + (xPos + maxRad + hiddenRad) + "," + yPos +
                    " A " + hiddenRad + "," + hiddenRad + " 0 1,0 " + (xPos + maxRad - hiddenRad) + "," + yPos)
                .style("stroke-width", 2)
                .attr("stroke", "black")
                .attr("stroke-opacity", 0)
                .style("fill", "none")
                .attr("fill-opacity", 0)
                .on('mouseover', function() {
                    highlights.selectAll(".highlightcircle").remove();
                    highlights
                        .append("circle")
                        .attr("stroke", "cornflowerblue")
                        .style("stroke-width", 2)
                        .style("fill", "white")
                        .attr("r", hiddenRad)
                        .attr("cx", (xPos + maxRad))
                        .attr("cy", yPos)
                        .attr("class", "highlightcircle");
                    d3.select("#teamCircle").style("fill-opacity", 0.05);
                    d3.select("#teamCircleHidden").style("stroke", "cornflowerblue");
                    d3.select("#teamCircle").style("stroke-opacity", 0);
                    tipCurr.show();
                })
                .on('mouseout', function() {
                    highlights.selectAll(".highlightcircle").remove();
                    d3.select("#teamCircle").style("fill-opacity", 1);
                    d3.select("#teamCircle").style("stroke", "black");
                    d3.select("#teamCircleHidden").style("stroke", "black");
                    d3.select("#teamCircleHidden").attr("stroke-opacity", 0);
                    d3.select("#teamCircle").style("stroke-opacity", 1);
                    tipCurr.hide();
                });
        }
        else {
            circles.append("path")
                .attr("class", "teambubblezoom")
                .attr("id", "otherCircleHidden")
                .attr("d", "M " + (xPos + maxRad - hiddenRad) + "," + yPos + " A " + hiddenRad + "," + hiddenRad + " 0 1,0 " + (xPos + maxRad + hiddenRad) + "," + yPos +
                    " A " + hiddenRad + "," + hiddenRad + " 0 1,0 " + (xPos + maxRad - hiddenRad) + "," + yPos)
                .style("fill", "none")
                .attr("stroke", "grey")
                .style("stroke-width", 1)
                .style("stroke-opacity", 0.3)
                .attr("fill-opacity", 0)
                .on('mouseover', function() {
                    highlights.selectAll(".highlightcircle").remove();
                    highlights
                        .append("circle")
                        .attr("stroke", "orange")
                        .style("stroke-width", 2)
                        .style("fill", "white")
                        .attr("r", hiddenRad)
                        .attr("cx", (xPos + maxRad))
                        .attr("cy", yPos)
                        .attr("class", "highlightcircle");
                    d3.select("#teamCircle").style("fill-opacity", 0.05);
                    d3.select("#teamCircle").style("stroke-width", 1);
                    d3.select("#teamCircle").style("stroke-opacity", 0);
                    if (hiddenRad == yearMaxRad) {
                        tipMax.show();
                    }
                    else if (hiddenRad == yearAverageRad) {
                        tipAverage.show();
                    }
                    else if (hiddenRad == yearMinRad) {
                        tipMin.show();
                    }
                })
                .on('mouseout', function() {
                    highlights.selectAll(".highlightcircle").remove();
                    d3.select("#teamCircle").style("fill-opacity", 1);
                    d3.select("#teamCircle").style("stroke-width", 2);
                    d3.select("#teamCircle").style("stroke", "black");
                    d3.select("#teamCircle").style("stroke-opacity", 1);
                    if (hiddenRad == yearMaxRad) {
                        tipMax.hide();
                    }
                    else if (hiddenRad == yearAverageRad) {
                        tipAverage.hide();
                    }
                    else if (hiddenRad == yearMinRad) {
                        tipMin.hide();
                    }
                });
            }
    }
}

function drawArrows(dataInput, teamName, year, arrowVariable, shirtScaler, playersInStayedOldStayedCurrOut, svg, w, h, maxWidthInOutPart, maxHeightRectArrowInOutPart, maxWidthStayedPart, maxHeightStayedPart, maxWidthRectArrowStayedPart) {
    var minWidthInOutPart = 1/10 * maxWidthInOutPart,
        minHeightStayedPart = 0;

    var arrowIncoming = svg.append('g')
        .attr('id', 'incoming');

    var arrowStayed = svg.append('g')
        .attr('id', 'stayed')

    var arrowOutgoing = svg.append('g')
        .attr('id', 'outgoing')

    var tipIncoming = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return  "<strong>Incoming value: </strong> <\p> Value of players who were not playing for the team in the previous season but are playing for the team in the current season."
        }); 
		
    var tipOutgoing = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return  "<strong>Outgoing value: </strong> <\p> Value of players who were playing for the team in the previous season but are not playing of the team in the current season."
        });

    var tipStayed = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return  "<strong>Stayed value: </strong> <\p> Difference in value of players who were playing for the team both in the current and the previous season."
        });

    svg.call(tipIncoming);
    svg.call(tipOutgoing);
    svg.call(tipStayed);

    var inStayedOutValue = [-1, -1, -1];
    var minMaxValueAllYears = [-1, -1, -1];
	
	var nbOfPlayersIncoming = playersInStayedOldStayedCurrOut[0].length;
	var nbOfPlayersStayed = playersInStayedOldStayedCurrOut[2].length;
	var nbOfPlayersOutgoing = playersInStayedOldStayedCurrOut[3].length;

    inStayedOutValue = statInStayedOut(playersInStayedOldStayedCurrOut, arrowVariable);
    minMaxValueAllYears = minMaxStat(dataInput, arrowVariable);

    var scaleValueHorizontalIncoming = scaleArrow(inStayedOutValue[0], minMaxValueAllYears[0], minMaxValueAllYears[1], minWidthInOutPart, (maxWidthInOutPart - 7.5*(2*maxHeightRectArrowInOutPart/20)));

    arrowIncoming.append("use")
        .attr("xlink:href","#transferRectHorizontal")
        .attr("class", "arrowIn")
        .attr('transform', function(d) {
            return "translate(" + (maxWidthInOutPart - 7.5*maxHeightRectArrowInOutPart/10 - scaleValueHorizontalIncoming) + ", " +  (h/2 - maxHeightRectArrowInOutPart - margin.bottom/4) + "), scale(" + (scaleValueHorizontalIncoming/50) + ", " + (2*maxHeightRectArrowInOutPart/20) +")";
            /*50 is lengte balk
             7.5 is breedte pijlkop
             10 is hoogte balk
             20 is hoogte pijlkop*/
        })
        .on('mouseover', function() {
            tipIncoming.show(document.getElementById("arrowInText"));

        })
        .on('mouseout', function() {
            tipIncoming.hide();

        });

    arrowIncoming.append("use")
        .attr("xlink:href","#arrowRight2")
		.attr("id", "arrowInMarker")
        .attr("class", "arrowIn")
        .attr('transform', function(d) {
            return "translate(" + (maxWidthInOutPart - 7.5*maxHeightRectArrowInOutPart/10) + ", " +  (h/2 - maxHeightRectArrowInOutPart - margin.bottom/4) + "), scale(" + (2*maxHeightRectArrowInOutPart/20) + ", " + (2*maxHeightRectArrowInOutPart/20) +")";
            /*50 is lengte balk
             7.5 is breedte pijlkop
             10 is hoogte balk
             20 is hoogte pijlkop*/
        })
        .on('mouseover', function() {
            tipIncoming.show(document.getElementById("arrowInText"));

        })
        .on('mouseout', function() {
            tipIncoming.hide();

        });

    arrowIncoming.append('text')
		.attr("id", "arrowInText")
        .attr("x", (maxWidthInOutPart - minWidthInOutPart - 7.5*maxHeightRectArrowInOutPart/10))
        .attr("y", (h/2 - 2*maxHeightRectArrowInOutPart - margin.bottom/2))
        /*50 is lengte balk
         7.5 is breedte pijlkop
         10 is hoogte balk
         20 is hoogte pijlkop*/
        .attr("text-anchor", "end")
        .text("" + inStayedOutValue[0].toFixed(1) + "  (" + nbOfPlayersIncoming + ")")
		.on('mouseover', function() {
            tipIncoming.show();

        })
        .on('mouseout', function() {
            tipIncoming.hide();

        });

    drawBestTwoShirts(playersInStayedOldStayedCurrOut[0], teamName, svg, 0, (h/2 - maxHeightRectArrowInOutPart - margin.bottom/2 - 70),
        (50 + margin.left), (h/2 - maxHeightRectArrowInOutPart - margin.bottom/2 - 70), arrowVariable, shirtScaler);
    /*50 is lengte balk
     7.5 is breedte pijlkop
     10 is hoogte balk
     20 is hoogte pijlkop
     70 is hoogte truitje
     50 is breedte truitje*/

    var scaleValueHorizontalOutgoing = scaleArrow(inStayedOutValue[2], minMaxValueAllYears[4], minMaxValueAllYears[5], minWidthInOutPart, (maxWidthInOutPart - 7.5*(2*maxHeightRectArrowInOutPart/20)));

    arrowOutgoing.append("use")
        .attr("xlink:href","#transferRectHorizontal")
		.attr("id", "arrowOutRectangle")
        .attr("class", "arrowOut")
        .attr('transform', function(d) {
            return "translate(" + (maxWidthInOutPart - scaleValueHorizontalOutgoing) + ", " +  (h/2 + margin.bottom/4) + "), scale(" + (scaleValueHorizontalOutgoing/50) + ", " + (2*maxHeightRectArrowInOutPart/20) +")";
            /*50 is lengte balk
             7.5 is breedte pijlkop
             10 is hoogte balk
             20 is hoogte pijlkop*/
        })
        .on('mouseover', function() {
            tipOutgoing.show();

        })
        .on('mouseout', function() {
            tipOutgoing.hide();

        });

    arrowOutgoing.append("use")
        .attr("xlink:href","#arrowLeft2")
        .attr("class", "arrowOut")
        .attr('transform', function(d) {
            return "translate(" + (maxWidthInOutPart - scaleValueHorizontalOutgoing) + ", " +  (h/2 + margin.bottom/4) + "), scale(" + (2*maxHeightRectArrowInOutPart/20) + ", " + (2*maxHeightRectArrowInOutPart/20) +")";
            /*50 is lengte balk
             7.5 is breedte pijlkop
             10 is hoogte balk
             20 is hoogte pijlkop*/
        })
        .on('mouseover', function() {
            tipOutgoing.show(document.getElementById("arrowOutRectangle"));

        })
        .on('mouseout', function() {
            tipOutgoing.hide();

        });

    arrowOutgoing.append('text')
        .attr("x", (maxWidthInOutPart - minWidthInOutPart - 7.5*maxHeightRectArrowInOutPart/10))
        .attr("y", (h/2 + 2*maxHeightRectArrowInOutPart + margin.bottom/2))
        /*50 is lengte balk
         7.5 is breedte pijlkop
         10 is hoogte balk
         20 is hoogte pijlkop*/
        .attr("text-anchor", "end")
        .attr("dy", "0.71em")
        .text("" + inStayedOutValue[2].toFixed(1) + "  (" + nbOfPlayersOutgoing + ")")
		.on('mouseover', function() {
            tipOutgoing.show(document.getElementById("arrowOutRectangle"));

        })
        .on('mouseout', function() {
            tipOutgoing.hide();

        });

    drawBestTwoShirts(playersInStayedOldStayedCurrOut[3], teamName, svg, 0, (h/2 + maxHeightRectArrowInOutPart + margin.bottom/2),
        (50 + margin.left), (h/2 + maxHeightRectArrowInOutPart + margin.bottom/2), arrowVariable, shirtScaler);
    /*50 is lengte balk
     7.5 is breedte pijlkop
     10 is hoogte balk
     20 is hoogte pijlkop
     70 is hoogte truitje
     50 is breedte truitje*/

    var maxStayed = Math.max(Math.abs(minMaxValueAllYears[2]), minMaxValueAllYears[3]);
    var scaleValueVerticalStayed = scaleArrow(Math.abs(inStayedOutValue[1]), 0, maxStayed, minHeightStayedPart, (maxHeightStayedPart/2 - 10*(maxWidthRectArrowStayedPart/10)));
    var increaseBoolean = true;

    if (parseFloat(inStayedOutValue[1]) > 0) {
        increaseBoolean = true;
        arrowStayed.append("use")
            .attr("xlink:href","#transferRectVertical")
            .attr("class", "arrowStayedUp")
            .attr('transform', function(d) {
                return "translate(" + (w - maxWidthStayedPart + 10*(maxWidthRectArrowStayedPart/10)) + ", " +  (h/2 - scaleValueVerticalStayed) + "), scale(" + (maxWidthRectArrowStayedPart/10) + ", " + (scaleValueVerticalStayed/50) +")";
                /*50 is hoogte balk
                 20 is breedte pijlkop
                 10 is breedte balk
                 10 is hoogte pijlkop*/
            })
            .on('mouseover', function() {
                tipStayed.show(document.getElementById("arrowStayedPositiveMarker"));

            })
            .on('mouseout', function() {
                tipStayed.hide();

            });

        arrowStayed.append("use")
            .attr("xlink:href","#arrowUp")
			.attr("id", "arrowStayedPositiveMarker")
            .attr("class", "arrowStayedUp")
            .attr('transform', function(d) {
                return "translate(" + (w - maxWidthStayedPart + 10*(maxWidthRectArrowStayedPart/10)) + ", " + (h/2 - scaleValueVerticalStayed - (10*(maxWidthRectArrowStayedPart/10))) + "), scale(" + (maxWidthRectArrowStayedPart/10) + ", " + (maxWidthRectArrowStayedPart/10) +")";
                /*50 is lengte balk
                 7.5 is breedte pijlkop
                 10 is hoogte balk
                 20 is hoogte pijlkop*/
            })
            .on('mouseover', function() {
                tipStayed.show();

            })
            .on('mouseout', function() {
                tipStayed.hide();

            });

    }
    else if(parseFloat(inStayedOutValue[1]) < 0) {
        increaseBoolean = false;
        arrowStayed.append("use")
            .attr("xlink:href","#transferRectVertical")
            .attr("class", "arrowStayedDown")
            .attr('transform', function(d) {
                return "translate(" + (w - maxWidthStayedPart + 10*(maxWidthRectArrowStayedPart/10)) + ", " +  (h/2) + "), scale(" + (maxWidthRectArrowStayedPart/10) + ", " + (scaleValueVerticalStayed/50) +")";
                /*50 is hoogte balk
                 20 is breedte pijlkop
                 10 is breedte balk
                 10 is hoogte pijlkop*/
            })
            .on('mouseover', function() {
                tipStayed.show(document.getElementById("arrowStayedPositiveMarker"));

            })
            .on('mouseout', function() {
                tipStayed.hide();

            });

        arrowStayed.append("use")
            .attr("xlink:href","#arrowDown")
            .attr("class", "arrowStayedDown")
            .attr('transform', function(d) {
                return "translate(" + (w - maxWidthStayedPart + 10*(maxWidthRectArrowStayedPart/10)) + ", " +  (h/2 + scaleValueVerticalStayed) + "), scale(" + (maxWidthRectArrowStayedPart/10) + ", " + (maxWidthRectArrowStayedPart/10) +")";
                /*50 is lengte balk
                 7.5 is breedte pijlkop
                 10 is hoogte balk
                 20 is hoogte pijlkop*/
            })
            .on('mouseover', function() {
                tipStayed.show(document.getElementById("arrowStayedPositiveMarker"));

            })
            .on('mouseout', function() {
                tipStayed.hide();

            });

    }

    arrowStayed.append('text')
        .attr("x", (w - maxWidthStayedPart + 20*(maxWidthRectArrowStayedPart/10) + margin.left/2))
        .attr("y", (h/2))
        //20 is breedte pijl
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .text("" + inStayedOutValue[1].toFixed(1) + "  (" + nbOfPlayersStayed + ")")
		.on('mouseover', function() {
                tipStayed.show(document.getElementById("arrowStayedPositiveMarker"));

            })
            .on('mouseout', function() {
                tipStayed.hide();

            });


    arrowStayed.append("use")
        .attr("xlink:href","#transferVerticalZeroLine")
        .attr('transform', function(d) {
            return "translate(" + (w - maxWidthStayedPart + 10 * (maxWidthRectArrowStayedPart / 10)) + ", " + (h / 2) + "), scale(" + (maxWidthRectArrowStayedPart / 10) + ", " + (maxWidthRectArrowStayedPart / 10) + ")";
        })
		.on('mouseover', function() {
                tipStayed.show(document.getElementById("arrowStayedPositiveMarker"));

            })
            .on('mouseout', function() {
                tipStayed.hide();

            });

    drawMostInfluenceTwoShirts(playersInStayedOldStayedCurrOut[1], playersInStayedOldStayedCurrOut[2], increaseBoolean, teamName, svg, (w - maxWidthStayedPart + 20*(maxWidthRectArrowStayedPart/10) + margin.left), (h/2 - margin.bottom - 70),
        (w - maxWidthStayedPart + 20*(maxWidthRectArrowStayedPart/10) + margin.left), (h/2 + margin.bottom), arrowVariable, shirtScaler);

}

function drawBestTwoShirts(players, teamName, svg, x1, y1, x2, y2, playerStat, scaler) {

    //function drawScaledShirt(xPos, yPos, player, team, chart, scale) {
    var bestPlayers = bestTwoPlayers(players);
    if (bestPlayers.length >= 1) {
        //drawShirt(x1, y1, bestPlayers[0].Player, bestPlayers[0]["No."], team);
        drawScaledShirt(x1,
            y1,
            bestPlayers[0],
            teamName,
            svg,
            scaler(playerStat(bestPlayers[0])));
        if (bestPlayers.length >= 2) {
            //drawShirt(x2, y2, bestPlayers[1].Player, bestPlayers[1]["No."], team);
            drawScaledShirt(x2,
                y2,
                bestPlayers[1],
                teamName,
                svg,
                scaler(playerStat(bestPlayers[1])));
        }
    }
}

function findPlayer(players, playerName) {
    for (var i=0, len=players.length; i<len; i++) {
        if (players[i].Player == playerName) {
            return players[i];
        }
    }
}

function drawMostInfluenceTwoShirts(playersOld, playersNew, increaseBoolean, teamName, svg, x1, y1, x2, y2, playerStat, scaler) {

    //function drawScaledShirt(xPos, yPos, player, team, chart, scale) {
    var playersWithPERDifference = playerPERDifference(playersOld, playersNew);
    var mostChangedPlayers = [];
	var bestPlayers = [];
    if (increaseBoolean) {
        mostChangedPlayers = bestTwoPlayers(playersWithPERDifference);
    }
    else {
        mostChangedPlayers = worstTwoPlayers(playersWithPERDifference);
    }
	if (mostChangedPlayers.length >= 1) {
		var bestPlayer1 = findPlayer(playersNew, mostChangedPlayers[0].Player);
		if (mostChangedPlayers.length >= 2) {
			var bestPlayer2 = findPlayer(playersNew, mostChangedPlayers[1].Player);
		}
    }
	bestPlayers = [bestPlayer1, bestPlayer2];
    if (bestPlayers.length >= 1) {
        //drawShirt(x1, y1, bestPlayers[0].Player, bestPlayers[0]["No."], team);
        drawScaledShirt(x1,
            y1,
            bestPlayers[0],
            teamName,
            svg,
            scaler(playerStat(bestPlayers[0])));
        if (bestPlayers.length >= 2) {
            //drawShirt(x2, y2, bestPlayers[1].Player, bestPlayers[1]["No."], team);
            drawScaledShirt(x2,
                y2,
                bestPlayers[1],
                teamName,
                svg,
                scaler(playerStat(bestPlayers[1])));
        }
    }
}

function separatePlayers(previousPlayers, currentPlayers) {

    var incomingPlayers = [],
        outgoingPlayers = [],
        stayedPlayersOld = [],
        stayedPlayersNew = [];

    currentPlayers.forEach(function (currPlayer) {
        var isNew = true;
        previousPlayers.forEach(function (prevPlayer) {
            if (currPlayer.Player == prevPlayer.Player) {
                isNew = false;
            }
        });
        if (!isNew) {
            stayedPlayersNew.push(currPlayer);
        }
        else {
            incomingPlayers.push(currPlayer);
        }
    });
    previousPlayers.forEach(function (prevPlayer) {
        var isGone = true;
        currentPlayers.forEach(function (currPlayer) {
            if (currPlayer.Player == prevPlayer.Player) {
                isGone = false;
            }
        });
        if (isGone) {
            outgoingPlayers.push(prevPlayer);
        }
        else {
            stayedPlayersOld.push(prevPlayer);
        }
    });

    return [incomingPlayers, stayedPlayersOld, stayedPlayersNew, outgoingPlayers];
}

function totalStat(players, stat) {
    var total = 0;
    for (var i = 0; i<players.length; i++) {
        total += parseFloat(stat(players[i]));
    }
    return total;
}

function statInStayedOut(separatedPlayersTeam, stat) {
    var statIncoming = totalStat(separatedPlayersTeam[0], stat);
    var statStayed = totalStat(separatedPlayersTeam[2], stat) - totalStat(separatedPlayersTeam[1], stat);
    var statOutgoing = totalStat(separatedPlayersTeam[3], stat);
    return [statIncoming, statStayed, statOutgoing];
}

function minMaxStat(dataInput, stat) {

    var minYear = d3.min(dataInput, function (data) {
        return parseInt(data.year);
    });
    var maxYear = d3.max(dataInput, function (data) {
        return parseInt(data.year);
    });
    var allTeams = [];
    var minMaxInStayedOut = [Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE];

    dataInput.forEach(function (yearData) {
        yearData.teams.forEach(function (teamData) {
            var indexTeam = allTeams.indexOf(teamData.team);
            if (indexTeam == -1) {
                allTeams.push(teamData.team);
            }
        });
    });

    allTeams.forEach(function (currTeam) {

        for (var i = minYear + 1 - minYear; i <= maxYear - minYear; i++) {
            var previousPlayers = [],
                currentPlayers = [],
                playersArray = [];

            dataInput[i - 1].teams.forEach(function (teamData) {
                if (teamData.team == currTeam) {
                    previousPlayers = teamData.players;
                }
            });

            dataInput[i].teams.forEach(function (teamData) {
                if (teamData.team == currTeam) {
                    currentPlayers = teamData.players;
                }
            });
            playersArray = separatePlayers(previousPlayers, currentPlayers);


            var StatIncoming = totalStat(playersArray[0], stat);
            var StatStayed = totalStat(playersArray[2], stat) - totalStat(playersArray[1], stat);
            var StatOutgoing = totalStat(playersArray[3], stat);

            if (StatIncoming < minMaxInStayedOut[0]) {
                minMaxInStayedOut[0] = StatIncoming;
            }
            if (StatIncoming > minMaxInStayedOut[1]) {
                minMaxInStayedOut[1] = StatIncoming;
            }
            if (StatStayed < minMaxInStayedOut[2]) {
                minMaxInStayedOut[2] = StatStayed;
            }
            if (StatStayed > minMaxInStayedOut[3]) {
                minMaxInStayedOut[3] = StatStayed;
            }
            if (StatOutgoing < minMaxInStayedOut[4]) {
                minMaxInStayedOut[4] = StatOutgoing;
            }
            if (StatOutgoing > minMaxInStayedOut[5]) {
                minMaxInStayedOut[5] = StatOutgoing;
            }
        }

    });
    return minMaxInStayedOut;
}

function minMaxStatPlayer(dataInput, stat) {

    var minYear = d3.min(dataInput, function (data) {
        return parseInt(data.year);
    });
    var maxYear = d3.max(dataInput, function (data) {
        return parseInt(data.year);
    });
    var allTeams = [];
    var minMaxPlayer = [Number.MAX_VALUE, -Number.MAX_VALUE];

	
	dataInput.forEach(function (yearData) {
		yearData.teams.forEach(function (teamData) {
			teamData.players.forEach(function (playerData) {
				var statPlayer = stat(playerData);
				
				if (statPlayer < minMaxPlayer[0]) {
                minMaxPlayer[0] = statPlayer;
				}
				if (statPlayer > minMaxPlayer[1]) {
					minMaxPlayer[1] = statPlayer;
				}
				
			});
		});
        
    });
    return minMaxPlayer;
}



function getRadiusScaledCircle(value, maxWidth, maxHeight, minValue, maxValue) {
    var maxRadius;
    var minRadius;
    if (maxWidth > maxHeight) {
        maxRadius = maxHeight/2;
        minRadius = maxHeight/12;
    }
    else if (maxWidth <= maxHeight) {
        maxRadius = maxWidth/2;
        minRadius = maxWidth/12;
    }

    //Get rid of negative values
    var adjustedMinValue = minValue - minValue +1;
    var adjustedMaxValue = maxValue - minValue +1;
    var adjustedValue = value - minValue +1;

	// Flannery	
//    var newMaxRadius = 1.0083 * Math.pow((adjustedMaxValue/adjustedMinValue),0.5716) * minRadius;
//    var newMinRadius = 1.0083 * Math.pow((adjustedMinValue/adjustedMinValue),0.5716) * minRadius;
//    var newValueRadius = 1.0083 * Math.pow((adjustedValue/adjustedMinValue),0.5716) * minRadius;
	
	// Quadratic
	var newMaxRadius = Math.pow(adjustedMaxValue, 1.5);
	var newMinRadius = Math.pow(adjustedMinValue, 1.5);
	var newValueRadius = Math.pow(adjustedValue, 1.5);

    var result = d3.scale.linear().range([minRadius,maxRadius]).domain([newMinRadius,newMaxRadius])(newValueRadius);

    return result;
//    var unity = (maxAreaSpace-minAreaSpace)/(maxArea-minArea);
////    return minSpace + result*unity;
//    var calculatedArea =  minAreaSpace + (givenArea-minArea)*unity;

    //return Math.sqrt(calculatedArea/Math.PI);

    /*Flannery Appearance Compensation case:
     Pj = 1.0083 * (Valj/ValMin)^0.5716 * Pmin
     Where:
     Pj = point size of the j'th feature
     Valj = value of the j'th feature
     ValMin = minimum value
     Pmin = minimum point size
     ^0.5 is to the power of 0.5 (square root)
     ^0.5716 is to the power of 0.5716 */
}

function scaleArrow(arrowVariable, minArrowVariable, maxArrowVariable, minSpace, maxSpace) {
    var unity = (maxSpace-minSpace)/(maxArrowVariable-minArrowVariable);
    return minSpace + (arrowVariable-minArrowVariable)*unity;
}

function minMaxSRS(data) {
    var minMaxSRS = [Number.MAX_VALUE, - Number.MAX_VALUE];

    data.forEach(function (yearData) {
        yearData.teams.forEach(function (teamData) {
            if (teamData.srs < minMaxSRS[0]) {
                minMaxSRS[0] = teamData.srs;
            }
            if (parseFloat(teamData.srs) > minMaxSRS[1]) {
                minMaxSRS[1] = teamData.srs;
            }

        });
    })
    return minMaxSRS;
}

function minMaxTeamSRS(data, teamName) {
    var minMaxSRSTeam = [Number.MAX_VALUE, - Number.MAX_VALUE];
    data.forEach(function (yearData) {
        yearData.teams.forEach(function (teamData) {
            if (teamData.team == teamName) {
                if (teamData.srs < minMaxSRSTeam[0]) {
                    minMaxSRSTeam[0] = teamData.srs;
                }
                if (teamData.srs > minMaxSRSTeam[1]) {
                    minMaxSRSTeam[1] = teamData.srs;
                }
            }
        });
    })
    return minMaxSRSTeam;
}

function minMaxSRSYear(data, yearWanted) {
    var minMaxSRSTeam = [Number.MAX_VALUE, - Number.MAX_VALUE];

    data.forEach(function (yearData) {
        if (yearData.year == yearWanted) {
            yearData.teams.forEach(function (teamData) {
                if (teamData.srs < minMaxSRSTeam[0]) {
                    //minMaxSRSTeam[0] = (teamData.srs).toFixed(1);
                    minMaxSRSTeam[0] = teamData.srs;
                }
                if (teamData.srs > minMaxSRSTeam[1]) {
                    //minMaxSRSTeam[1] = (teamData.srs).toFixed(1);
                    minMaxSRSTeam[1] = teamData.srs;
                }
            });
        }
    })
    return minMaxSRSTeam;
}

function worstTwoPlayers(players) {
    var result = [],
        min1 = Number.MAX_VALUE,
        min2 = Number.MAX_VALUE;
    for (var i = 0; i<players.length; i++) {
        if (! (players[i].advanced == undefined)) {
            if (players[i].advanced.PER < min1) {
                if (result.length > 0) {
                    min2 = min1;
                    result[1] = result[0];
                }
                min1 = players[i].advanced.PER;
                result[0] = players[i];
            }
            else if (players[i].advanced.PER < min2) {
                min2 = players[i].advanced.PER;
                result[1] = players[i];
            }
        }
    }
    return result;
}

function bestTwoPlayers(players) {
    var result = [],
        max1 = - Number.MAX_VALUE,
        max2 = - Number.MAX_VALUE;
    for (var i = 0; i<players.length; i++) {
        if (! (players[i].advanced == undefined)) {
            if (players[i].advanced.PER > max1) {
                if (result.length > 0) {
                    max2 = max1;
                    result[1] = result[0];
                }
                max1 = players[i].advanced.PER;
                result[0] = players[i];
            }
            else if (players[i].advanced.PER > max2) {
                max2 = players[i].advanced.PER;
                result[1] = players[i];
            }
        }
    }
    return result;
}

function playerPERDifference(players1, players2) {
    var result = [];
    for (var i = 0; i<players1.length && i<players2.length; i++) {
        var diff = players2[i].advanced.PER - players1[i].advanced.PER;
        var newPlayer = jQuery.extend(true, {}, players2[i]);
        newPlayer.advanced.PER = diff;
        result.push(newPlayer);
    }

    return result;
}
