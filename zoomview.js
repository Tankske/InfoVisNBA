
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

function drawTransfers(inData, teamWanted, yearWanted, arrowVariable, svg, xpos, ypos, w, h) {

    //console.log(teamWanted, yearWanted, arrowVariable);
    d3.select(".zoomchart").remove();



    var previousPlayers = [],
        currentPlayers = [],
        arrayPlayers = [],
        teamSRS = 0;
//                minMax = [];
//    var minMaxPERAllYears = [-30, 200, -20, 40];
    var minMaxPERAllYears = minMaxPER(inData);
    var minMaxSRSAllYears = minMaxSRS(inData);
    var minMaxTransfersAllYears = minMaxNbTransfers(inData);

    //var sideBarWidth = 0.1*w;
    //var chartWidth = w - sideBarWidth - margin.left;
    var chartWidth = w;

    var maxWidthInOutPart = chartWidth*1/2 - margin.left/2;
    var minWidthInOutPart = 1/10 * maxWidthInOutPart;

    var maxWidthCircle = chartWidth*1/3 - margin.left;

    var maxWidthStayedPart = chartWidth - maxWidthInOutPart - maxWidthCircle - 2*margin.left;

    var maxHeightStayedPart = h;
    var minHeightStayedPart = 0;

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
//            minMax = minMaxPerSeason(data,yearWanted);


    //// Dimensions of sidebar item: width, height, spacing, radius of rounded rect.
    //var si = {
    //    w: 70, h: 30, s: 5, r: 3
    //};
    //
    //var sidebar = svg.append("svg")
    //    .attr("class","sidebar")
    //    .attr("width", sideBarWidth)
    //    .attr("height", h)
    //    .attr("x", chartWidth + margin.left);
    //
    //sidebar.append("rect")
    //    .attr("x", 0)
    //    .attr("y", 0)
    //    .attr("width", si.w)
    //    .attr("height", si.h)
    //    .style("fill", "#bbbbbb")
    //    .on('mouseover', function() { d3.select(this).style('fill','orange'); })
    //    .on('mouseout', function() { d3.select(this).style('fill','#bbbbbb'); })
    //    .on("click", function() { console.log("CLICKED"); });
    //
    //
    //sidebar.append("svg:text")
    //    .attr("x", si.w/2)
    //    .attr("y", si.h/2)
    //    .attr("dy", "0.35em")
    //    .attr("text-anchor", "middle")
    //    .style("fill", "#000000")
    //    .text("PER");
    //
    //sidebar.append("rect")
    //    .attr("x", 0)
    //    .attr("y", si.h + si.s)
    //    .attr("width", si.w)
    //    .attr("height", si.h)
    //    .style("fill", "#bbbbbb")
    //    .attr("overflow", "auto")
    //    .on('mouseover', function() { d3.select(this).style('fill','orange'); })
    //    .on('mouseout', function() { d3.select(this).style('fill','#bbbbbb'); })
    //    .on("click", function() { console.log("CLICKED"); });
    //
    //sidebar.append("svg:text")
    //    .attr("x", si.w/2)
    //    .attr("y", si.h + si.s + si.h/2)
    //    .attr("dy", "0.35em")
    //    .attr("text-anchor", "middle")
    //    .attr("overflow", "auto")
    //    .style("fill", "#000000")
    //    .text("Nb Players");

    var chart = svg.append("svg")					//Append one div to the selected div in which we will construct the visualisation. This is done to separate mutliple visualisations..
        .attr("class","chart zoomchart")
        .attr("width", chartWidth)
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


    function drawShirt(xPos, yPos, name, number, team) {
        team = fixteamname(team);
        var shirtColor = ShirtColors[team].shirt;
        var shirtEdge = ShirtColors[team].edge;
//                if (shirtColor)
//console.log("test" + shirtColor);
//                console.log(shirtEdge);
        var playerShirt = chart.append("svg")
            .attr("viewbox", "0, 0, 50, 70")
            .attr("overflow", "hidden")
            .attr("x", xPos)
            .attr("y", yPos)
            .attr("width", 50)
            .attr("height", 70)
            .append("g")
            .attr("position", "absolute")
            .attr("class", "shirt");
//
//                    .attr("width", (width/2-margin.right-margin.left)/3)
//                    .attr("height", (width/2-margin.right-margin.left)*7/15);

        playerShirt.append("rect")
            //                    .attr("shape-rendering", "crispEdges")
            .attr("width", 50)
            .attr("height", 70)
            .attr("fill", shirtColor);



        playerShirt.append("ellipse")
            //                    .attr("shape-rendering", "crispEdges")
            .attr("fill", "white")
            .attr("rx", 8)
            .attr("ry", 20)
            .attr("cy", 5)
            .attr("cx", 0)
            .attr("stroke-width", 2)
            .attr("stroke", shirtEdge);

        playerShirt.append("ellipse")
            //                    .attr("shape-rendering", "crispEdges")
            .attr("fill", "white")
            .attr("rx", 8)
            .attr("ry", 20)
            .attr("cy", 5)
            .attr("cx", 50)
            .attr("stroke-width", 2)
            .attr("stroke", shirtEdge);

        playerShirt.append("ellipse")
            //                    .attr("shape-rendering", "crispEdges")
            .attr("fill", "white")
            .attr("rx", 8)
            .attr("ry", 8)
            .attr("cy", 0)
            .attr("cx", 25)
            .attr("stroke-width", 2)
            .attr("stroke", shirtEdge);

        playerShirt.append("text")
            .attr("id", (name.split(" ")).pop())
            .attr("x", 10)
            .attr("y", 25)
            .attr("textLength", 30)
            .attr("lengthAdjust", "spacingAndGlyphs")
            .attr("fill", "#ffffff")
            .text((name.split(" ")).pop());

        playerShirt.append("text")
            .attr("id", (name.split(" ")).pop() + "number")
            .attr("x", 25)
            .attr("y", 55)
            .attr("text-anchor", "middle")
            .attr("textLength", 25)
            .attr("lengthAdjust", "spacing")
            .attr("fill", "#ffffff")
            .attr("font-family", "Helvetica")
            .attr("font-weight", "bold")
            .attr("font-size", "25px")
            .text(number);

        return playerShirt;
    }

    var rad = getRadiusScaledCircle(teamSRS, maxWidthCircle, h, minMaxSRSAllYears[0], minMaxSRSAllYears[1]);
    var maxRad = getRadiusScaledCircle(minMaxSRSAllYears[1], maxWidthCircle, h, minMaxSRSAllYears[0], minMaxSRSAllYears[1]);
    var minRad = getRadiusScaledCircle(minMaxSRSAllYears[0], maxWidthCircle, h, minMaxSRSAllYears[0], minMaxSRSAllYears[1]);
    console.log(maxRad);
    console.log(minRad);


    chart.append("path")
        .attr("d", "M 0,0 h 50")
        .attr("stroke", "black")
        .attr('transform', function(d) {
            return "translate(0, " +  (h/2) + "), scale(" + (maxWidthInOutPart/50) + ", 1)";
        });

    var circles = chart.append('g')
        .attr('class', 'circleTeam');

    circles.append("circle")
        .attr("class", "teambubblezoom")
        .attr("cx", (chartWidth/2 + margin.left/2 + rad)) //arrow heigth is half of the width
        .attr("cy", (h/2))
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



    var arrowIncoming = chart.append('g')
        .attr('id', 'incoming');

    var arrowStayed = chart.append('g')
        .attr('id', 'stayed')

    var arrowOutgoing = chart.append('g')
        .attr('id', 'outgoing')

    var incomingPer = totalPER(arrayPlayers[0]).toFixed(1),
        outgoingPer = totalPER(arrayPlayers[3]).toFixed(1),
        stayedPer = (totalPER(arrayPlayers[2]) - totalPER(arrayPlayers[1])).toFixed(1);

    var nbIncomingTransfers = arrayPlayers[0].length,
        nbStayedTransfers = arrayPlayers[2].length,
        nbOutgoingTransfers = arrayPlayers[3].length;


    var scaleValueXIn = scaleArrow(incomingPer, minMaxPERAllYears[0], minMaxPERAllYears[1], minWidthInOutPart, (maxWidthInOutPart - 7.5*(2*arrowRectHorizontalHeight/20)));

    arrowIncoming.append("use")
        .attr("xlink:href","#transferRectHorizontal")
        .attr("class", "arrowIn")
        .attr('transform', function(d) {
            return "translate(" + (maxWidthInOutPart - 7.5*arrowRectHorizontalHeight/10 - scaleValueXIn) + ", " +  (h/2 - arrowRectHorizontalHeight - margin.bottom/4) + "), scale(" + (scaleValueXIn/50) + ", " + (2*arrowRectHorizontalHeight/20) +")";
            /*50 is lengte balk
            7.5 is breedte pijlkop
            10 is hoogte balk
            20 is hoogte pijlkop*/
        });

    arrowIncoming.append("use")
        .attr("xlink:href","#arrowRight2")
        .attr("class", "arrowIn")
        .attr('transform', function(d) {
            return "translate(" + (maxWidthInOutPart - 7.5*arrowRectHorizontalHeight/10) + ", " +  (h/2 - arrowRectHorizontalHeight - margin.bottom/4) + "), scale(" + (2*arrowRectHorizontalHeight/20) + ", " + (2*arrowRectHorizontalHeight/20) +")";
            /*50 is lengte balk
             7.5 is breedte pijlkop
             10 is hoogte balk
             20 is hoogte pijlkop*/
        });

    arrowIncoming.append('text')
        .attr("x", (maxWidthInOutPart - minWidthInOutPart - 7.5*arrowRectHorizontalHeight/10))
        .attr("y", (h/2 - 2*arrowRectHorizontalHeight - margin.bottom/2))
        /*50 is lengte balk
         7.5 is breedte pijlkop
         10 is hoogte balk
         20 is hoogte pijlkop*/
        .attr("text-anchor", "end")
        .text("" + incomingPer);

    drawBestTwoShirts(arrayPlayers[0], teamWanted, 0, (h/2 - arrowRectHorizontalHeight - margin.bottom/2 - 70),
        (50 + margin.left), (h/2 - arrowRectHorizontalHeight - margin.bottom/2 - 70));
    /*50 is lengte balk
     7.5 is breedte pijlkop
     10 is hoogte balk
     20 is hoogte pijlkop
     70 is hoogte truitje
     50 is breedte truitje*/

    var scaleValueXOut = scaleArrow(outgoingPer, minMaxPERAllYears[4], minMaxPERAllYears[5], minWidthInOutPart, (maxWidthInOutPart - 7.5*(2*arrowRectHorizontalHeight/20)));

    arrowOutgoing.append("use")
        .attr("xlink:href","#transferRectHorizontal")
        .attr("class", "arrowOut")
        .attr('transform', function(d) {
            return "translate(" + (maxWidthInOutPart - scaleValueXOut) + ", " +  (h/2 + margin.bottom/4) + "), scale(" + (scaleValueXOut/50) + ", " + (2*arrowRectHorizontalHeight/20) +")";
            /*50 is lengte balk
             7.5 is breedte pijlkop
             10 is hoogte balk
             20 is hoogte pijlkop*/
        });

    arrowOutgoing.append("use")
        .attr("xlink:href","#arrowLeft2")
        .attr("class", "arrowOut")
        .attr('transform', function(d) {
            return "translate(" + (maxWidthInOutPart - scaleValueXOut) + ", " +  (h/2 + margin.bottom/4) + "), scale(" + (2*arrowRectHorizontalHeight/20) + ", " + (2*arrowRectHorizontalHeight/20) +")";
            /*50 is lengte balk
             7.5 is breedte pijlkop
             10 is hoogte balk
             20 is hoogte pijlkop*/
        });

    arrowOutgoing.append('text')
        .attr("x", (maxWidthInOutPart - minWidthInOutPart - 7.5*arrowRectHorizontalHeight/10))
        .attr("y", (h/2 + 2*arrowRectHorizontalHeight + margin.bottom/2))
        /*50 is lengte balk
         7.5 is breedte pijlkop
         10 is hoogte balk
         20 is hoogte pijlkop*/
        .attr("text-anchor", "end")
        .attr("dy", "0.71em")
        .text("" + outgoingPer);

    drawBestTwoShirts(arrayPlayers[3], teamWanted, 0, (h/2 + arrowRectHorizontalHeight + margin.bottom/2),
        (50 + margin.left), (h/2 + arrowRectHorizontalHeight + margin.bottom/2));
    /*50 is lengte balk
     7.5 is breedte pijlkop
     10 is hoogte balk
     20 is hoogte pijlkop
     70 is hoogte truitje
     50 is breedte truitje*/

    var maxStayed = Math.max(Math.abs(minMaxPERAllYears[2]), minMaxPERAllYears[3]);
    var scaleValueYStayed = scaleArrow(Math.abs(stayedPer), 0, maxStayed, minHeightStayedPart, (maxHeightStayedPart/2 - 10*(arrowRectVerticalWidth/10)));

    if (parseFloat(stayedPer) > 0) {

        arrowStayed.append("use")
            .attr("xlink:href","#transferRectVertical")
            .attr("class", "arrowStayedUp")
            .attr('transform', function(d) {
                return "translate(" + (chartWidth - maxWidthStayedPart + margin.left/2 + 10*(arrowRectVerticalWidth/10)) + ", " +  (h/2 - scaleValueYStayed) + "), scale(" + (arrowRectVerticalWidth/10) + ", " + (scaleValueYStayed/50) +")";
                /*50 is hoogte balk
                 20 is breedte pijlkop
                 10 is breedte balk
                 10 is hoogte pijlkop*/
            });

        arrowStayed.append("use")
            .attr("xlink:href","#arrowUp")
            .attr("class", "arrowStayedUp")
            .attr('transform', function(d) {
                return "translate(" + (chartWidth - maxWidthStayedPart + margin.left/2 + 10*(arrowRectVerticalWidth/10)) + ", " + (h/2 - scaleValueYStayed - (10*(arrowRectVerticalWidth/10))) + "), scale(" + (arrowRectVerticalWidth/10) + ", " + (arrowRectVerticalWidth/10) +")";
                /*50 is lengte balk
                 7.5 is breedte pijlkop
                 10 is hoogte balk
                 20 is hoogte pijlkop*/
            });

    }
    else if(parseFloat(stayedPer) < 0) {

        arrowStayed.append("use")
            .attr("xlink:href","#transferRectVertical")
            .attr("class", "arrowStayedDown")
            .attr('transform', function(d) {
                return "translate(" + (chartWidth - maxWidthStayedPart + margin.left/2 + 10*(arrowRectVerticalWidth/10)) + ", " +  (h/2) + "), scale(" + (arrowRectVerticalWidth/10) + ", " + (scaleValueYStayed/50) +")";
                /*50 is hoogte balk
                 20 is breedte pijlkop
                 10 is breedte balk
                 10 is hoogte pijlkop*/
            });

        arrowStayed.append("use")
            .attr("xlink:href","#arrowDown")
            .attr("class", "arrowStayedDown")
            .attr('transform', function(d) {
                return "translate(" + (chartWidth - maxWidthStayedPart + margin.left/2 + 10*(arrowRectVerticalWidth/10)) + ", " +  (h/2 + scaleValueYStayed) + "), scale(" + (arrowRectVerticalWidth/10) + ", " + (arrowRectVerticalWidth/10) +")";
                /*50 is lengte balk
                 7.5 is breedte pijlkop
                 10 is hoogte balk
                 20 is hoogte pijlkop*/
            });

    }

    arrowStayed.append('text')
        .attr("x", (chartWidth - maxWidthStayedPart + margin.left/2 + 20*(arrowRectVerticalWidth/10) + margin.left/2))
        .attr("y", (h/2))
        //20 is breedte pijl
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .text("" + stayedPer);


    arrowStayed.append("use")
        .attr("xlink:href","#transferVerticalZeroLine")
        .attr('transform', function(d) {
            return "translate(" + (chartWidth - maxWidthStayedPart + margin.left / 2 + 10 * (arrowRectVerticalWidth / 10)) + ", " + (h / 2) + "), scale(" + (arrowRectVerticalWidth / 10) + ", " + (arrowRectVerticalWidth / 10) + ")";
        });

    var playersStayed = playerPERDifference(arrayPlayers[1], arrayPlayers[2]);
    drawBestTwoShirts(playersStayed, teamWanted, (chartWidth - maxWidthStayedPart + margin.left/2 + 20*(arrowRectVerticalWidth/10) + margin.left/2 + margin.left), (h/2 - margin.bottom - 70),
        (chartWidth - maxWidthStayedPart + margin.left/2 + 20*(arrowRectVerticalWidth/10) + margin.left/2 + margin.left), (h/2 + margin.bottom ));


    function stayedShirts(playersOld, playersNew) {
        var players = playerPERDifference(playersOld, playersNew);
        var bestPlayers = bestTwoPlayers(players);
        var height = (2*maxRad + 2*margin.top + 30);
        var w1 = (w/2 - maxRad/4 + 40);
        if (bestPlayers.length >= 1) {
            //drawShirt(w1, height, bestPlayers[0].Player, bestPlayers[0]["No."], teamWanted);
            var wh = drawScaledShirt(w1,
                height,
                bestPlayers[0],
                teamWanted,
                chart,
                exagerratedPerScale(bestPlayers[0].advanced.PER),
                tip);
            if (bestPlayers.length >= 2) {
                //drawShirt(w1 + 50 + margin.left, height, bestPlayers[1].Player, bestPlayers[1]["No."], teamWanted);
                drawScaledShirt(w1 + wh.width + margin.left,
                    height,
                    bestPlayers[1],
                    teamWanted,
                    chart,
                    exagerratedPerScale(bestPlayers[1].advanced.PER),
                    tip);
            }
        }
    }

    function drawBestTwoShirts(players, team, x1, y1, x2, y2) {
        var bestPlayers = bestTwoPlayers(players);
        if (bestPlayers.length >= 1) {
            //drawShirt(x1, y1, bestPlayers[0].Player, bestPlayers[0]["No."], team);
            var wh = drawScaledShirt(x1,
                y1,
                bestPlayers[0],
                teamWanted,
                chart,
                exagerratedPerScale(bestPlayers[0].advanced.PER),
                tip);
            if (bestPlayers.length >= 2) {
                //drawShirt(x2, y2, bestPlayers[1].Player, bestPlayers[1]["No."], team);
                drawScaledShirt(x2,
                    y2,
                    bestPlayers[1],
                    teamWanted,
                    chart,
                    exagerratedPerScale(bestPlayers[1].advanced.PER),
                    tip);
            }
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
                if (PEROutgoing < minMaxInStayedOut[0]) {
                    minMaxInStayedOut[0] = PEROutgoing;
                }
                if (PEROutgoing > minMaxInStayedOut[1]) {
                    minMaxInStayedOut[1] = PEROutgoing;
                }
            }

        }
    });
    minMaxInStayedOut[4] = minMaxInStayedOut[0];
    minMaxInStayedOut[5] = minMaxInStayedOut[1];
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
