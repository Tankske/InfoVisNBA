
var ShirtColors = {
    TorontoRaptors : {shirt: "#ff0000", edge:  "#000000"},
    BostonCeltics : {shirt: "#008000", edge: "#ffffff"},
    BrooklynNets : {shirt: "#000000", edge: "#ffffff"},
    Philadelphia76ers : {shirt: "#ff0000", edge: "#0000ff"},
    NewYorkKnicks  : {shirt: "#0000ff;", edge: "#ff4500"},
    ClevelandCavaliers : {shirt: "#8b0000", edge: "#ffd700"},
    ChicagoBulls : {shirt: "#ff0000", edge: "#000000"},
    MilwaukeeBucks : {shirt: "#006400", edge: "#ff0000"},
    IndianaPacers : {shirt: "#000080", edge: "#ffd700"},
    DetroitPistons : {shirt: "#0000ff", edge: "##ff0000"},
    AtlantaHawks : {shirt: "#000080", edge: "#ff0000"},
    WashingtonWizards : {shirt: "#ff0000", edge: "#000080"},
    MiamiHeat : {shirt: "#000000", edge: "#8b0000"},
    CharlotteHornets : {shirt: "#800080", edge: "#008080"},
    OrlandoMagic : {shirt: "#0000ff", edge: "#000000"},
    PortlandTrailBlazers : {shirt: "#000000", edge: "#ff0000"},
    OklahomaCityThunder : {shirt: "#009acd", edge: "#00008b"},
    UtahJazz : {shirt: "#000080", edge: "#006400"},
    DenverNuggets : {shirt: "#6ca6cd", edge: "#000080"},
    MinnesotaTimberwolves : {shirt: "#00688b", edge: "#000000"},
    GoldenStateWarriors : {shirt: "#0000ff", edge: "#ffd700"},
    LosAngelesClippers : {shirt: "#ff0000", edge: "#0000ff"},
    PhoenixSuns : {shirt: "#800080", edge: "#ff8c00"},
    SacramentoKings : {shirt: "#800080", edge: "#000000"},
    LosAngelesLakers : {shirt: "#800080", edge: "#ffd700"},
    HoustonRockets : {shirt: "#ff0000", edge: "#ffffff"},
    SanAntonioSpurs : {shirt: "#000000", edge: "#c0c0c0"},
    MemphisGrizzlies : {shirt: "#191970", edge: "#6ca6cd"},
    DallasMavericks : {shirt: "#000080", edge: "#0000ff"},
    NewOrleansPelicans : {shirt: "#00008b", edge: "#ffd700"},
    BuffaloBraves : {shirt: "6ca6cd", edge: "000000"},
    BaltimoreBullets : {shirt: "0000ff", edge: "ff0000"},
    CincinnatiRoyals : {shirt: "0000ff", edge: "ffffff"},
    SeattleSuperSonics : {shirt: "006400", edge: "ffd700"},
    KansasCityOmahaKings : {shirt: "0000ff", edge: "ff0000"},
    CapitalBullets : {shirt: "0000ff", edge: "ff0000"},
    WashingtonBullets : {shirt: "ff0000", edge: "0000ff"},
    NewOrleansJazz : {shirt: "800080", edge: "ffd700"},
    KansasCityKings : {shirt: "0000ff", edge: "ff0000"},
    NewYorkNets : {shirt: "0000ff", edge: "ff0000"},
    NewJerseyNets : {shirt: "000080", edge: "ff0000"},
    SanDiegoClippers : {shirt: "0000ff", edge: "ff0000"},
    VancouverGrizzlies : {shirt: "40e0d0", edge: "000000"},
    NewOrleansHornets : {shirt: "009acd", edge: "551a8b"},
    CharlotteBobcats : {shirt: "000080", edge: "add8e6"}
}

var margin = {top: 20, right: 20, bottom: 20, left: 20};

function drawTransfers(inData, teamWanted, yearWanted, arrowVariable, svg, xpos, ypos, w, h) {

    d3.select(".zoomchart").remove();

    var previousPlayers = [],
        currentPlayers = [],
        arrayPlayers = [],
        teamSRS = 0;

    var minMaxSRSAllYears = minMaxSRS(inData);

    var maxWidthInOutPart = w*1/2 - margin.left/ 2;

    var maxWidthCircle = w*1/3 - margin.left;

    var maxWidthStayedPart = w - maxWidthInOutPart - maxWidthCircle - 2*margin.left;

    var maxHeightStayedPart = h;

    var arrowRectHorizontalHeight = h/8;
    var arrowRectVerticalWidth = maxWidthStayedPart/10;


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

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            console.log(d);
            return  "<p><span style='color:orange'>" + d["Player"] + "</span> <\p>" +
                "PER: <span style='color:red'>" + d.advanced["PER"] + "</span> </br>" +
                "Height: <span style='color:red'>" + d["Ht"] + "</span> </br>" +
                "Weight: <span style='color:red'>" + d["Wt"] + "</span> </br>" +
                "Birthday: <span style='color:red'>" + d["Birth Date"] + "</span> </br>";
        });
    chart.call(tip);

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

    var teamName = teamWanted.replace(/\s+/g, '');
    defs.append('pattern')
        .attr('id', function(d) { return (teamName+"logo");}) // just create a unique id (id comes from the json)
        .attr('patternContentUnits', 'objectBoundingBox')
        .attr('width', 1)
        .attr('height', 1)
        .append("svg:image")
        .attr("xlink:xlink:href", function(d) { return ("./teamlogos/" + teamName.toLowerCase() + ".png");})
        .attr("height", 0.8)
        .attr("width", 0.8)
        .attr("x", 0.1)
        .attr("y", 0.1)
        .attr("preserveAspectRatio", "xMidYMid meet");


    drawTeamCircle(teamName, teamSRS, minMaxSRSAllYears[0], minMaxSRSAllYears[1], chart, (xpos + w/2 + margin.left/2), (ypos + h/2), maxWidthCircle, h);
    //TODO Arrowvariable
    drawArrows(inData, teamName, "PER", arrayPlayers, chart, w, h, maxWidthInOutPart, arrowRectHorizontalHeight, maxWidthStayedPart, maxHeightStayedPart, arrowRectVerticalWidth);
}



function drawArrows(dataInput, teamName, arrowVariable, playersInStayedOldStayedCurrOut, svg, w, h, maxWidthInOutPart, maxHeightRectArrowInOutPart, maxWidthStayedPart, maxHeightStayedPart, maxWidthRectArrowStayedPart) {

    var minWidthInOutPart = 1/10 * maxWidthInOutPart,
        minHeightStayedPart = 0;

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            console.log(d);
            return "<p><span style='color:orange'>" + d["Player"] + "</span> <\p>" +
                "PER: <span style='color:red'>" + d.advanced["PER"] + "</span> </br>" +
                "Height: <span style='color:red'>" + d["Ht"] + "</span> </br>" +
                "Weight: <span style='color:red'>" + d["Wt"] + "</span> </br>" +
                "Birthday: <span style='color:red'>" + d["Birth Date"] + "</span> </br>";
        });

    var arrowIncoming = svg.append('g')
        .attr('id', 'incoming');

    var arrowStayed = svg.append('g')
        .attr('id', 'stayed')

    var arrowOutgoing = svg.append('g')
        .attr('id', 'outgoing')

    var inStayedOutValue = [-1, -1, -1];
    var minMaxValueAllYears = [-1, -1, -1];

    if (arrowVariable == "PER") {
        inStayedOutValue = PERTeam(playersInStayedOldStayedCurrOut);
        minMaxValueAllYears = minMaxPER(dataInput);
    }
    else if (arrowVariable == "No. Players") {
        inStayedOutValue = nbTransfersTeam(playersInStayedOldStayedCurrOut);
        minMaxValueAllYears = minMaxNbTransfers(dataInput);
    }
    console.log(minMaxValueAllYears);
    console.log(minMaxPER(dataInput));

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
        });

    arrowIncoming.append("use")
        .attr("xlink:href","#arrowRight2")
        .attr("class", "arrowIn")
        .attr('transform', function(d) {
            return "translate(" + (maxWidthInOutPart - 7.5*maxHeightRectArrowInOutPart/10) + ", " +  (h/2 - maxHeightRectArrowInOutPart - margin.bottom/4) + "), scale(" + (2*maxHeightRectArrowInOutPart/20) + ", " + (2*maxHeightRectArrowInOutPart/20) +")";
            /*50 is lengte balk
             7.5 is breedte pijlkop
             10 is hoogte balk
             20 is hoogte pijlkop*/
        });

    arrowIncoming.append('text')
        .attr("x", (maxWidthInOutPart - minWidthInOutPart - 7.5*maxHeightRectArrowInOutPart/10))
        .attr("y", (h/2 - 2*maxHeightRectArrowInOutPart - margin.bottom/2))
        /*50 is lengte balk
         7.5 is breedte pijlkop
         10 is hoogte balk
         20 is hoogte pijlkop*/
        .attr("text-anchor", "end")
        .text("" + inStayedOutValue[0]);

    drawBestTwoShirts(playersInStayedOldStayedCurrOut[0], teamName, svg, 0, (h/2 - maxHeightRectArrowInOutPart - margin.bottom/2 - 70),
        (50 + margin.left), (h/2 - maxHeightRectArrowInOutPart - margin.bottom/2 - 70), tip);
    /*50 is lengte balk
     7.5 is breedte pijlkop
     10 is hoogte balk
     20 is hoogte pijlkop
     70 is hoogte truitje
     50 is breedte truitje*/

    var scaleValueHorizontalOutgoing = scaleArrow(inStayedOutValue[2], minMaxValueAllYears[4], minMaxValueAllYears[5], minWidthInOutPart, (maxWidthInOutPart - 7.5*(2*maxHeightRectArrowInOutPart/20)));

    arrowOutgoing.append("use")
        .attr("xlink:href","#transferRectHorizontal")
        .attr("class", "arrowOut")
        .attr('transform', function(d) {
            return "translate(" + (maxWidthInOutPart - scaleValueHorizontalOutgoing) + ", " +  (h/2 + margin.bottom/4) + "), scale(" + (scaleValueHorizontalOutgoing/50) + ", " + (2*maxHeightRectArrowInOutPart/20) +")";
            /*50 is lengte balk
             7.5 is breedte pijlkop
             10 is hoogte balk
             20 is hoogte pijlkop*/
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
        .text("" + inStayedOutValue[2]);

    drawBestTwoShirts(playersInStayedOldStayedCurrOut[3], teamName, svg, 0, (h/2 + maxHeightRectArrowInOutPart + margin.bottom/2),
        (50 + margin.left), (h/2 + maxHeightRectArrowInOutPart + margin.bottom/2), tip);
    /*50 is lengte balk
     7.5 is breedte pijlkop
     10 is hoogte balk
     20 is hoogte pijlkop
     70 is hoogte truitje
     50 is breedte truitje*/

    var maxStayed = Math.max(Math.abs(minMaxValueAllYears[2]), minMaxValueAllYears[3]);
    var scaleValueVerticalStayed = scaleArrow(Math.abs(inStayedOutValue[1]), 0, maxStayed, minHeightStayedPart, (maxHeightStayedPart/2 - 10*(maxWidthRectArrowStayedPart/10)));

    if (parseFloat(inStayedOutValue[2]) > 0) {

        arrowStayed.append("use")
            .attr("xlink:href","#transferRectVertical")
            .attr("class", "arrowStayedUp")
            .attr('transform', function(d) {
                return "translate(" + (w - maxWidthStayedPart + margin.left/2 + 10*(maxWidthRectArrowStayedPart/10)) + ", " +  (h/2 - scaleValueVerticalStayed) + "), scale(" + (maxWidthRectArrowStayedPart/10) + ", " + (scaleValueVerticalStayed/50) +")";
                /*50 is hoogte balk
                 20 is breedte pijlkop
                 10 is breedte balk
                 10 is hoogte pijlkop*/
            });

        arrowStayed.append("use")
            .attr("xlink:href","#arrowUp")
            .attr("class", "arrowStayedUp")
            .attr('transform', function(d) {
                return "translate(" + (w - maxWidthStayedPart + margin.left/2 + 10*(maxWidthRectArrowStayedPart/10)) + ", " + (h/2 - scaleValueVerticalStayed - (10*(maxWidthRectArrowStayedPart/10))) + "), scale(" + (maxWidthRectArrowStayedPart/10) + ", " + (maxWidthRectArrowStayedPart/10) +")";
                /*50 is lengte balk
                 7.5 is breedte pijlkop
                 10 is hoogte balk
                 20 is hoogte pijlkop*/
            });

    }
    else if(parseFloat(inStayedOutValue[2]) < 0) {

        arrowStayed.append("use")
            .attr("xlink:href","#transferRectVertical")
            .attr("class", "arrowStayedDown")
            .attr('transform', function(d) {
                return "translate(" + (w - maxWidthStayedPart + margin.left/2 + 10*(maxWidthRectArrowStayedPart/10)) + ", " +  (h/2) + "), scale(" + (maxWidthRectArrowStayedPart/10) + ", " + (scaleValueVerticalStayed/50) +")";
                /*50 is hoogte balk
                 20 is breedte pijlkop
                 10 is breedte balk
                 10 is hoogte pijlkop*/
            });

        arrowStayed.append("use")
            .attr("xlink:href","#arrowDown")
            .attr("class", "arrowStayedDown")
            .attr('transform', function(d) {
                return "translate(" + (w - maxWidthStayedPart + margin.left/2 + 10*(maxWidthRectArrowStayedPart/10)) + ", " +  (h/2 + scaleValueVerticalStayed) + "), scale(" + (maxWidthRectArrowStayedPart/10) + ", " + (maxWidthRectArrowStayedPart/10) +")";
                /*50 is lengte balk
                 7.5 is breedte pijlkop
                 10 is hoogte balk
                 20 is hoogte pijlkop*/
            });

    }

    arrowStayed.append('text')
        .attr("x", (w - maxWidthStayedPart + margin.left/2 + 20*(maxWidthRectArrowStayedPart/10) + margin.left/2))
        .attr("y", (h/2))
        //20 is breedte pijl
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .text("" + inStayedOutValue[1]);


    arrowStayed.append("use")
        .attr("xlink:href","#transferVerticalZeroLine")
        .attr('transform', function(d) {
            return "translate(" + (w - maxWidthStayedPart + margin.left / 2 + 10 * (maxWidthRectArrowStayedPart / 10)) + ", " + (h / 2) + "), scale(" + (maxWidthRectArrowStayedPart / 10) + ", " + (maxWidthRectArrowStayedPart / 10) + ")";
        });

    var playersStayed = playerPERDifference(playersInStayedOldStayedCurrOut[1], playersInStayedOldStayedCurrOut[2]);
    drawBestTwoShirts(playersStayed, teamName, svg, (w - maxWidthStayedPart + margin.left/2 + 20*(maxWidthRectArrowStayedPart/10) + margin.left/2 + margin.left), (h/2 - margin.bottom - 70),
        (w - maxWidthStayedPart + margin.left/2 + 20*(maxWidthRectArrowStayedPart/10) + margin.left/2 + margin.left), (h/2 + margin.bottom ), tip);

}

function drawTeamCircle(teamName, teamSRS, minSRSAllYears, maxSRSAllYears, svg, xPos, yPos, w, h ) {

    var rad = getRadiusScaledCircle(teamSRS, w, h, minSRSAllYears, maxSRSAllYears);
    var maxRad = getRadiusScaledCircle(maxSRSAllYears, w, h, minSRSAllYears, maxSRSAllYears);
    var minRad = getRadiusScaledCircle(minSRSAllYears, w, h, minSRSAllYears, maxSRSAllYears);
    console.log(maxRad);
    console.log(minRad);

    var circles = svg.append('g')
        .attr('class', 'circleTeam');

    circles.append("circle")
        .attr("class", "teambubblezoom")
        .attr("cx", xPos + maxRad) //arrow heigth is half of the width
        .attr("cy", yPos)
        .attr("r", rad)
        //.attr("overflow", "hidden")
        .style("fill", function(d) { return ("url(#" + teamName + "logo)");});
    //TODO als logo er ni instaat een placeholder?

    //circles.append("circle")
    //    .attr("class", "teambubblezoom")
    //    .attr("cx", (chartWidth/2 + margin.left/2 + minRad)) //arrow heigth is half of the width
    //    .attr("cy", (h/2))
    //    .attr("r", minRad)
    //    .attr("stroke", "black")
    //    .style("fill", "green")
    //    .style("opacity", 0.7);
    //circles.append("circle")
    //    .attr("class", "teambubblezoom")
    //    .attr("cx", (chartWidth/2 + margin.left/2 + (maxRad-minRad)/2+minRad)) //arrow heigth is half of the width
    //    .attr("cy", (h/2))
    //    .attr("r", (maxRad-minRad)/2+minRad)
    //    .attr("stroke", "black")
    //    .style("fill", "orange")
    //    .style("opacity", 0.5);
    //circles.append("circle")
    //    .attr("class", "teambubblezoom")
    //    .attr("cx", (chartWidth/2 + margin.left/2 + maxRad-minRad)) //arrow heigth is half of the width
    //    .attr("cy", (h/2))
    //    .attr("r", maxRad-minRad)
    //    .attr("stroke", "black")
    //    .style("fill", "yellow")
    //    .style("opacity", 0.3);
    //circles.append("circle")
    //    .attr("class", "teambubblezoom")
    //    .attr("cx", (chartWidth/2 + margin.left/2 + maxRad)) //arrow heigth is half of the width
    //    .attr("cy", (h/2))
    //    .attr("r", maxRad)
    //    .attr("stroke", "black")
    //    .style("fill", "red")
    //    .style("opacity", 0.1);

}

function drawBestTwoShirts(players, teamName, svg, x1, y1, x2, y2, tip) {

    var bestPlayers = bestTwoPlayers(players);
    if (bestPlayers.length >= 1) {
        //drawShirt(x1, y1, bestPlayers[0].Player, bestPlayers[0]["No."], team);
        drawScaledShirt(x1,
            y1,
            bestPlayers[0],
            teamName,
            svg,
            exagerratedPerScale(bestPlayers[0].advanced.PER),
            tip);
        if (bestPlayers.length >= 2) {
            //drawShirt(x2, y2, bestPlayers[1].Player, bestPlayers[1]["No."], team);
            drawScaledShirt(x2,
                y2,
                bestPlayers[1],
                teamName,
                svg,
                exagerratedPerScale(bestPlayers[1].advanced.PER),
                tip);
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

function totalPER(players) {
    var total = 0;
    for (var i = 0; i<players.length; i++) {
        if (!(players[i].advanced == undefined)) {
            total += parseFloat(players[i].advanced.PER);
        }
    }
    return total;
}

function PERTeam(separatedPlayersTeam) {

    var PERIncoming = totalPER(separatedPlayersTeam[0]).toFixed(1);
    var PERStayed = (totalPER(separatedPlayersTeam[2]) - totalPER(separatedPlayersTeam[1])).toFixed(1);
    var PEROutgoing = totalPER(separatedPlayersTeam[3]).toFixed(1);
    return [PERIncoming, PERStayed, PEROutgoing];
}

function nbTransfersTeam(separatedPlayersTeam) {

    var nbIncoming = separatedPlayersTeam[0].length;
    var nbStayed = separatedPlayersTeam[2].length;
    var nbOutgoing = separatedPlayersTeam[3].length;
    return [nbIncoming, nbStayed, nbOutgoing];
}

function minMaxNbTransfers(dataInput) {

    var minYear = d3.min(dataInput, function(data) {return parseInt(data.year);});
    var maxYear = d3.max(dataInput, function(data) {return parseInt(data.year);});
    var allTeams = [];
    var minMaxInStayedOut = [Number.MAX_VALUE, - Number.MAX_VALUE, Number.MAX_VALUE, - Number.MAX_VALUE, Number.MAX_VALUE, - Number.MAX_VALUE];


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

            dataInput[i-1].teams.forEach(function (teamData) {
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

            var nbIncoming = playersArray[0].length;
            var nbStayed = playersArray[2].length;
            var nbOutgoing = playersArray[3].length;

            if (nbIncoming < minMaxInStayedOut[0]) {
                minMaxInStayedOut[0] = nbIncoming;
            }
            if (nbIncoming > minMaxInStayedOut[1]) {
                minMaxInStayedOut[1] = nbIncoming;
            }
            if (nbStayed < minMaxInStayedOut[2]) {
                minMaxInStayedOut[2] = nbStayed;
            }
            if (nbStayed > minMaxInStayedOut[3]) {
                minMaxInStayedOut[3] = nbStayed;
            }
            if (nbOutgoing < minMaxInStayedOut[4]) {
                minMaxInStayedOut[4] = nbOutgoing;
            }
            if (nbOutgoing > minMaxInStayedOut[5]) {
                minMaxInStayedOut[5] = nbOutgoing;
            }
        }
    });
    return minMaxInStayedOut;
}

function minMaxPER(dataInput) {

    var minYear = d3.min(dataInput, function(data) {return parseInt(data.year);});
    var maxYear = d3.max(dataInput, function(data) {return parseInt(data.year);});
    var allTeams = [];
    var minMaxInStayedOut = [Number.MAX_VALUE, - Number.MAX_VALUE, Number.MAX_VALUE, - Number.MAX_VALUE, Number.MAX_VALUE, - Number.MAX_VALUE];

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

            dataInput[i-1].teams.forEach(function (teamData) {
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

            if (!(playersArray[2].length == 0 && (playersArray[0].length == 0 || playersArray[3].length == 0))) {

                var PERIncoming = totalPER(playersArray[0]);
                var PERStayed = totalPER(playersArray[2]) - totalPER(playersArray[1]);
                var PEROutgoing = totalPER(playersArray[3]);

                if (PERIncoming < minMaxInStayedOut[0]) {
                    minMaxInStayedOut[0] = PERIncoming;
                }
                if (PERIncoming > minMaxInStayedOut[1]) {
                    minMaxInStayedOut[1] = PERIncoming;
                }
                if (PERStayed < minMaxInStayedOut[2]) {
                    minMaxInStayedOut[2] = PERStayed;
                }
                if (PERStayed > minMaxInStayedOut[3]) {
                    minMaxInStayedOut[3] = PERStayed;
                }
                if (PEROutgoing < minMaxInStayedOut[4]) {
                    minMaxInStayedOut[4] = PEROutgoing;
                }
                if (PEROutgoing > minMaxInStayedOut[5]) {
                    minMaxInStayedOut[5] = PEROutgoing;
                }
            }
        }
    });
    return minMaxInStayedOut;
}

function getRadiusScaledCircle(areaVariable, maxWidth, maxHeight, min, max) {
    var maxSpace;
    var minSpace;
    if (maxWidth > maxHeight) {
        maxSpace = maxHeight/2;
        minSpace = maxHeight/12;
    }
    else if (maxWidth <= maxHeight) {
        maxSpace = maxWidth/2;
        minSpace = maxWidth/12;
    }

    var minValue = min - min +1;
    var maxValue = max - min +1;
    var areaVariableValue = areaVariable - min +1;

    var maxAreaSpace = Math.pow(maxSpace,2)*Math.PI;
    var minAreaSpace = Math.pow(minSpace,2)*Math.PI;
    var maxArea = Math.pow(maxValue,2)*Math.PI;
    var minArea = Math.pow(minValue,2)*Math.PI;
    var givenArea = Math.pow(areaVariableValue,2)*Math.PI;

    //var resultMax = 1.0083 * Math.pow((maxValue/minValue),0.5716) * minAreaSpace;
    //maxArea = resultMax;
    //
    //var resultMin = 1.0083 * Math.pow((minValue/minValue),0.5716) * minAreaSpace;
    //minArea = resultMin;
    //
    //var result = 1.0083 * Math.pow((areaVariableValue/minValue),0.5716) * minAreaSpace;
    //givenArea = result;


    var unity = (maxAreaSpace-minAreaSpace)/(maxArea-minArea);
//    return minSpace + result*unity;
    var calculatedArea =  minAreaSpace + (givenArea-minArea)*unity;

    return Math.sqrt(calculatedArea/Math.PI);
//    var unity = (maxSpace-minSpace)/(max-min);
////    return minSpace + result*unity;
//    return minSpace + (areaVariable-min)*unity;

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
            if (parseFloat(teamData.srs) < minMaxSRS[0]) {
                minMaxSRS[0] = parseFloat(teamData.srs).toFixed(1);
            }
            if (parseFloat(teamData.srs) > minMaxSRS[1]) {
                minMaxSRS[1] = parseFloat(teamData.srs).toFixed(1);
            }

        });
    })
    return minMaxSRS;
}

function bestTwoPlayers(players) {
    var result = [],
        max1 = - Number.MAX_VALUE,
        max2 = - Number.MAX_VALUE;
    for (var i = 0; i<players.length; i++) {
        if (! (players[i].advanced == undefined)) {
            if (parseFloat(players[i].advanced.PER) > parseFloat(max1)) {
                max1 = players[i].advanced.PER;
                if (result.length > 0) {
                    max2 = max1;
                    result[1] = result[0];
                }
                result[0] = players[i];
            }
            else if (parseFloat(players[i].advanced.PER) > parseFloat(max2)) {
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
        var diff = parseFloat(players2[i].advanced.PER) - parseFloat(players1[i].advanced.PER)
        var newPlayer = jQuery.extend(true, {}, players2[i]);
        newPlayer.advanced.PER = diff.toFixed(1);
        result.push(newPlayer);
    }

    return result;
}