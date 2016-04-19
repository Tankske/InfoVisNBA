function drawTransfers(inData, teamWanted, yearWanted, arrowVariable, svg, xpos, ypos, w, h) {
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

    //console.log(teamWanted, yearWanted, arrowVariable);
    d3.select(".zoomchart").remove();

    var margin = {top: 20, right: 20, bottom: 20, left: 20};

    var previousPlayers = [],
            currentPlayers = [],
            arrayPlayers = [],
            teamSRS = 0;
//                minMax = [];
    var minMaxPER = [-30, 200, -20, 40];
    var minMaxSRSAllYears = minMaxSRS(inData);


        inData.forEach(function (yearData) {
            if (yearData.year == yearWanted - 1) {

                //TODO What if team gets other name?
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


    var chart = svg
                .append("g")					//Append one div to the selected div in which we will construct the visualisation. This is done to separate mutliple visualisations..
                .attr("class","chart zoomchart")
                .attr("width", w)
                .attr("height", h);

    var defs = chart.append("defs");

    defs.append("path")
        .attr("d", "M 0,-5 v 10 h 50 v -10 z")
        .attr("id", "transferRectHorizontal");

    defs.append("path")
        .attr("d", "M 0,-10 v 20 l 10,-10 z")
        .attr("id", "arrowRight");

    defs.append("path")
        .attr("d", "M -5,0 v 50 h 10 v -50 z")
        .attr("id", "transferRectVertical");

    defs.append("path")
        .attr("d", "M 0,0 l -10,10 h 20 z")
        .attr("id", "arrowUp");

    defs.append("path")
        .attr("d", "M -10,0 h 20 l -10,10 z")
        .attr("id", "arrowDown");



    function drawShirt(xPos, yPos, name, number, team) {
        team = team.replace(/\s+/g, '');
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


    var rad = scaleCircle(teamSRS, w, h, minMaxSRSAllYears[0], minMaxSRSAllYears[1]);
    var maxRad = scaleCircle(minMaxSRSAllYears[1], w, h, minMaxSRSAllYears[0], minMaxSRSAllYears[1]);
    var minRad = scaleCircle(minMaxSRSAllYears[0], w, h, minMaxSRSAllYears[0], minMaxSRSAllYears[1]);
    //console.log(minRad);
    chart.append('g')
        .attr('class', 'circleTeam')
        .append("circle")
        .attr("class", "teambubblezoom")
        .attr("cx", (w/2)) //arrow heigth is half of the width
        .attr("cy", rad + margin.top)
        .attr("r", rad);


    var arrowIncoming = chart.append('g')
        .attr('id', 'incoming');

    var arrowStayed = chart.append('g')
            .attr('id', 'stayed')

    var arrowOutgoing = chart.append('g')
            .attr('id', 'outgoing')



    var incomingPer = totalPER(arrayPlayers[0]).toFixed(1),
        outgoingPer = totalPER(arrayPlayers[3]).toFixed(1),
        stayedPer = (totalPER(arrayPlayers[2]) - totalPER(arrayPlayers[1])).toFixed(1);

    var scaleValueXIn = scaleArrowHorizontal(incomingPer, w, h, minMaxPER[0], minMaxPER[1]);
    //console.log("In " + scaleValueXIn);
    //console.log("In " + incomingPer);
    //console.log("In " + minMaxPER[0]);
    //console.log("In " + minMaxPER[1]);
    //console.log("In " +  scaleValueXIn/50);


    arrowIncoming.append("use")
        .attr("xlink:href","#transferRectHorizontal")
        .attr("class", "arrowIn")
        .attr('transform', function(d) {
            return "translate(" + (w/2 - maxRad - margin.left - 30 - scaleValueXIn) + ", " +  (minRad + margin.top) + "), scale(" + (scaleValueXIn/50) + ", " + (10/minRad) +")";
            //TODO 50 is lengte rect
            //TODO 30 is lengte pijl maal scale y richting pijl
            //TODO 10 is hoogte balk
        });

    arrowIncoming.append("use")
        .attr("xlink:href","#arrowRight")
        .attr("class", "arrowIn")
        .attr('transform', function(d) {
            return "translate(" + (w/2 - maxRad - margin.left - 30) + ", " +  (minRad + margin.top) + "), scale(" + (15/minRad) + ", " + (15/minRad) +")";
        });

    arrowIncoming.append('text')
        .attr("x", w/2 - maxRad - margin.left - 30 - scaleValueXIn/2)
        .attr("y", (minRad + margin.top - (15/minRad)*10))
        //TODO 40 is hoogte pijleinde/2 (helft) maal scale y richting
        .attr("text-anchor", "middle")
        .text("" + incomingPer);


    drawBestTwoShirts(arrayPlayers[0], teamWanted, (w/2 - maxRad - margin.left - 30 - scaleValueXIn), (minRad + margin.top + (15/minRad)*10),
        (w/2 - maxRad - margin.left - 30 - scaleValueXIn + 50 + margin.left), (minRad + margin.top + (15/minRad)*10));




    var scaleValueXOut = scaleArrowHorizontal(outgoingPer, w, h, minMaxPER[0], minMaxPER[1]);
    //console.log("Out " + scaleValueXOut);
    //console.log("Out " + outgoingPer);
    //console.log("Out " + minMaxPER[0]);
    //console.log("Out " + minMaxPER[1]);
    //console.log("Out " +  scaleValueXOut/50);
    arrowOutgoing.append("use")
        .attr("xlink:href","#transferRectHorizontal")
        .attr("class", "arrowOut")
        .attr('transform', function(d) {
            return "translate(" + (w/2 + maxRad + margin.left) + ", " +  (minRad + margin.top) + "), scale(" + (scaleValueXOut/50) + ", " + (10/minRad) +")";
            //TODO 50 is lengte rect
        });

    arrowOutgoing.append("use")
        .attr("xlink:href","#arrowRight")
        .attr("class", "arrowOut")
        .attr('transform', function(d) {
            return "translate(" + (w/2 + maxRad + margin.left + scaleValueXOut) + ", " +  (minRad + margin.top) + "), scale(" + (15/minRad) + ", " + (15/minRad) +")";
        });

    arrowOutgoing.append('text')
        .attr("x", (w/2 + maxRad + margin.left + scaleValueXOut/2))
        .attr("y", (minRad + margin.top - (15/minRad)*10))
        //TODO 40 is hoogte pijleinde/2 (helft) maal scale y richting
        .attr("text-anchor", "middle")
        .text("" + outgoingPer);

    drawBestTwoShirts(arrayPlayers[3], teamWanted, (w/2 + maxRad + margin.left + scaleValueXOut - 50 + (15/minRad)*10), (minRad + margin.top + (15/minRad)*10),
        (w/2 + maxRad + margin.left + scaleValueXOut - 100 + (15/minRad)*10 - margin.left), (minRad + margin.top + (15/minRad)*10));



    var scaleValueYStayedPositive = scaleArrowVertical(stayedPer, w, h, 0, minMaxPER[3]);
    var scaleValueYStayedNegative = scaleArrowVertical(Math.abs(stayedPer), w, h, 0, Math.abs(minMaxPER[2]));

//                var stayedPer = parseFloat(totalPER(arrayPlayers[2])) - parseFloat(totalPER(arrayPlayers[1]))

    //console.log("Stayed " + scaleValueYStayedPositive);
    //console.log("Stayed " + stayedPer);
    //console.log("Stayed " + minMaxPER[2]);
    //console.log("Stayed " + minMaxPER[3]);
    //console.log("Stayed " +  scaleValueYStayedPositive/50);
    if (parseFloat(stayedPer) >= 0) {

        arrowStayed.append("use")
            .attr("xlink:href","#transferRectVertical")
            .attr("class", "arrowStayedUp")
            .attr('transform', function(d) {
                return "translate(" + (w/2 - maxRad/4) + ", " +  (2*maxRad + 2*margin.top + (15/minRad)*10) + "), scale(" + (10/minRad) + ", " + (scaleValueYStayedPositive/50) +")";
                //TODO 50 is lengte rect
                //TODO 30 is lengte pijl maal scale y richting pijl
            });

        arrowStayed.append("use")
            .attr("xlink:href","#arrowUp")
            .attr("class", "arrowStayedUp")
            .attr('transform', function(d) {
                return "translate(" + (w/2 - maxRad/4) + ", " +  (2*maxRad + 2*margin.top) + "), scale(" + (15/minRad) + ", " + (15/minRad) +")";
            });

        arrowStayed.append('text')
            .attr("x", (w/2 - maxRad/4 + 40))
            //TODO 40 is breedte pijleinde/2 (helft) maal scale x richting
            .attr("y", (2*maxRad + 2*margin.top))
            //TODO 30 is lengte pijl maal scale y richting pijl
            .attr("dy", ".71em")
            .text("" + stayedPer);

        var playersStayed = playerPERDifference(arrayPlayers[1], arrayPlayers[2]);
        drawBestTwoShirts(playersStayed, teamWanted, (w/2 - maxRad/4 + (15/minRad)*10), (maxRad + 2* margin.top + scaleValueYStayedPositive + (15/minRad)*10),
            (w/2 - maxRad/4 + (15/minRad)*10 + margin.left + 50), (maxRad + 2* margin.top + scaleValueYStayedPositive + (15/minRad)*10));


    }
    else if(parseFloat(stayedPer) < 0) {

        arrowStayed.append("use")
            .attr("xlink:href","#transferRectVertical")
            .attr("class", "arrowStayedDown")
            .attr('transform', function(d) {
                return "translate(" + (w/2 - maxRad/4) + ", " +  (2*maxRad + 2*margin.top) + "), scale(" + (15/minRad) + ", " + (scaleValueYStayedNegative/50) +")";
                //TODO 50 is lengte rect
                //TODO 30 is lengte pijl maal scale y richting pijl
            });

        arrowStayed.append("use")
            .attr("xlink:href","#arrowDown")
            .attr("class", "arrowStayedDown")
            .attr('transform', function(d) {
                return "translate(" + (w/2 - maxRad/4) + ", " +  (2*maxRad + 2*margin.top + scaleValueYStayedNegative) + "), scale(" + (15/minRad) + ", " + (15/minRad) +")";
            });

        arrowStayed.append('text')
            .attr("x", (w/2 - maxRad/4 + 40))
            //TODO 40 is breedte pijleinde/2 (helft) maal scale x richting
            .attr("y", (2*maxRad + 2*margin.top))
            .attr("dy", ".71em")
            .text("" + stayedPer);

        var playersStayed = playerPERDifference(arrayPlayers[1], arrayPlayers[2]);
        drawBestTwoShirts(playersStayed, teamWanted, (w/2 - maxRad/4 + (15/minRad)*10), (maxRad + 2* margin.top + scaleValueYStayedNegative + (15/minRad)*10),
            (w/2 - maxRad/4 + (15/minRad)*10 + margin.left + 50), (maxRad + 2* margin.top + scaleValueYStayedNegative + (15/minRad)*10));
    }


    function stayedShirts(playersOld, playersNew) {
        var players = playerPERDifference(playersOld, playersNew);
        var bestPlayers = bestTwoPlayers(players);
        var height = (2*maxRad + 2*margin.top + 30);
        var w1 = (w/2 - maxRad/4 + 40);
        if (bestPlayers.length >= 1) {
            drawShirt(w1, height, bestPlayers[0].Player, bestPlayers[0]["No."], teamWanted);
            if (bestPlayers.length >= 2) {
                drawShirt(w1 + 50 + margin.left, height, bestPlayers[1].Player, bestPlayers[1]["No."], teamWanted);
            }
        }
    }

    function drawBestTwoShirts(players, team, x1, y1, x2, y2) {
        var bestPlayers = bestTwoPlayers(players);
        if (bestPlayers.length >= 1) {
            drawShirt(x1, y1, bestPlayers[0].Player, bestPlayers[0]["No."], team);
            if (bestPlayers.length >= 2) {
                drawShirt(x2, y2, bestPlayers[1].Player, bestPlayers[1]["No."], team);
            }
        }
    }

    function scaleArrowHorizontal(arrowVariable, width, height, min, max) {
        var maxSpace;
        var minSpace;
        if (width/8 > height/6) {
            //max radius circle is height/6 en min radius circle is height/24
            maxSpace = width/2 - height/6 - 2*margin.left;
            minSpace = height/24;
        }
        else if (width/8 <= height/6) {
            //max radius circle is width/8 en min radius circle is width/32
            maxSpace = width/2 - width/8 - 2*margin.left;
            minSpace = width/32;
        }

        var unity = (maxSpace-minSpace)/(max-min);
//                    console.log(maxSpace);
//                    console.log( minSpace + (arrowVariable-min)*unity);
        return minSpace + (arrowVariable-min)*unity;
    }

    function scaleArrowVertical(arrowVariable, width, height, min, max) {
        var maxSpace;
        var minSpace;
        if (width/8 > height/6) {
            //max radius circle is height/6 en min radius circle is height/24
            maxSpace = margin.top + height/6 + margin.bottom;
            minSpace = height/24;
        }
        else if (width/8 <= height/6) {
            //max radius circle is width/8 en min radius circle is width/32
            maxSpace = margin.top + width/8 + margin.bottom;
            minSpace = width/32;
        }

        var unity = (maxSpace-minSpace)/(max-min);
//                    console.log(maxSpace);
//                    console.log( minSpace + (arrowVariable-min)*unity);
        return minSpace + (arrowVariable-min)*unity;
    }


//                var court = chart.append("svg")
//                        .attr("viewbox", "0, 0, 20, 20")
//                        .attr("width", 360)
//                        .attr("height", 370)
//                        .attr("x", 30)
//                        .attr("y", 500);
//
//
////            court.append("use")
////                    .attr("xlink:href","Basketball_Halfcourt.svg#svg23341");
//                court.append("rect")
//                        .attr("width", 20)
//                        .attr("height", 20)
//                        .attr("fill", "yellow");
//
//                court.append('text')
//                        .attr("position", "absolute")
//                        .attr("x", 50)
//                        .attr("y", 50)
//                        .attr("dy", ".5em")
//                        .text("SG");



    //PERChangesPosition(previousPlayers,currentPlayers, "pg");
    //PERChangesPosition(previousPlayers,currentPlayers, "pf");
    //PERChangesPosition(previousPlayers,currentPlayers, "sg");
    //PERChangesPosition(previousPlayers,currentPlayers, "sf");
    //PERChangesPosition(previousPlayers,currentPlayers, "c");




}




function scaleFactor(inOutStayedPlayers, start, end) {
    var inOut = [],
        perIn = totalPER(inOutStayedPlayers[0]),
        perOut = totalPER(inOutStayedPlayers[3]);
    if ((perIn == 0) && (perOut == 0)) {
        inOut = [0, 0];
    }
    else if (perIn == 0) {
        inOut = [0, end-start];
    }
    else if (perOut == 0) {
        inOut = [end-start, 0];
    }
    else if (perIn > perOut) {
        inOut = [end-start, start+(perOut/perIn)*(end-start)];
    }
    else if (perIn <= perOut) {
        inOut = [start+(perIn/perOut)*(end-start), end-start];
    }
    return inOut;
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
        if (!(players[i].PER == "")) {
            total += parseFloat(players[i].PER);
        }
    }
    return total;
}



function minMaxPerSeason(data, yearWanted) {
    var previousPlayersArray = [],
        currentPlayersArray = [],
        playersArray = [],
        minMaxInOutStay = [Number.MAX_VALUE, - Number.MAX_VALUE, Number.MAX_VALUE, - Number.MAX_VALUE, Number.MAX_VALUE, - Number.MAX_VALUE];

    data.forEach(function (yearData) {
        if (yearData.year == yearWanted - 1) {

            //TODO What if team gets other name?
            yearData.teams.forEach(function (teamData) {
                previousPlayersArray.push(teamData.players);

            });
        }

        if (yearData.year == yearWanted) {
            yearData.teams.forEach(function (teamData) {
                currentPlayersArray.push(teamData.players);

            });
        }
    });
    for(var i=0; i<currentPlayersArray.length; i++) {
        playersArray.push(separatePlayers(previousPlayersArray[i], currentPlayersArray[i]));
    }
    for(var i=0; i< playersArray.length; i++) {
        for(var j = 0; j<3; j++){
            if(j==0) {
                if (parseFloat(totalPER(playersArray[i][j])) < minMaxInOutStay[j*2]) {
                    minMaxInOutStay[j*2] = totalPER(playersArray[i][j]).toFixed(1);
                }
                if (parseFloat(totalPER(playersArray[i][j])) > minMaxInOutStay[j*2+1]) {
                    minMaxInOutStay[j*2+1] = totalPER(playersArray[i][j]).toFixed(1);
                }
            }
            if(j==1) {
                if (parseFloat(totalPER(playersArray[i][j+1])-totalPER(playersArray[i][j])) < minMaxInOutStay[j*2]) {
                    minMaxInOutStay[j*2] = (totalPER(playersArray[i][j+1])-totalPER(playersArray[i][j])).toFixed(1);
                }
                if (parseFloat(totalPER(playersArray[i][j+1])-totalPER(playersArray[i][j])) > minMaxInOutStay[j*2+1]) {
                    minMaxInOutStay[j*2+1] = (totalPER(playersArray[i][j+1])-totalPER(playersArray[i][j])).toFixed(1);
                }
            }
            if (j==2) {
                if (parseFloat(totalPER(playersArray[i][j+1])) < minMaxInOutStay[j*2]) {
                    minMaxInOutStay[j*2] = totalPER(playersArray[i][j+1]).toFixed(1);
                }
                if (parseFloat(totalPER(playersArray[i][j+1])) > minMaxInOutStay[j*2+1]) {
                    minMaxInOutStay[j*2+1] = totalPER(playersArray[i][j+1]).toFixed(1);
                }
            }
        }
    }
    return minMaxInOutStay;
}


function scaleCircle(radiusVariable, width, height, min, max) {
    var maxSpace;
    var minSpace;
    if (width/8 > height/6) {
        maxSpace = height/6;
        minSpace = height/24;
    }
    else if (width/8 <= height/6) {
        maxSpace = width/8;
        minSpace = width/32;
    }


//    var result = 1.0083 * Math.pow(((radiusVariable - min +1)/(min - min+1)),0.5716) * minSpace;
//    result =  Math.sqrt(result/Math.PI);


    var unity = (maxSpace-minSpace)/(max-min);
//    return minSpace + result*unity;
    return minSpace + (radiusVariable-min)*unity;

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
        if (! (players[i].PER == "")) {
            if (parseFloat(players[i].PER) > parseFloat(max1)) {
                max1 = players[i].PER;
                if (result.length > 0) {
                    max2 = max1;
                    result[1] = result[0];
                }
                result[0] = players[i];
            }
            else if (parseFloat(players[i].PER) > parseFloat(max2)) {
                max2 = players[i].PER;
                result[1] = players[i];
            }
        }
    }
    return result;
}

function playerPERDifference(players1, players2) {
    var result = [];
    for (var i = 0; i<players1.length && i<players2.length; i++) {
        var diff = parseFloat(players2[i].PER) - parseFloat(players1[i].PER)
        result.push({
            "Player": players2[i].Player,
            "No.": players2[i]["No."],
            "Pos": players2[i].Pos,
            "PER": diff.toFixed(1)
        });

    }

    return result;

}

function PERChangesPosition(players1, players2, position) {
    position = position.toUpperCase();
    var previousPlayers = players1.filter(function (player) {
        return player.Pos == position;
    });
    var currentPlayers = players2.filter(function (player) {
        return player.Pos == position;
    });
    var result = 0;
    var prevTemp = 0
    var currTemp = 0;
    console.log(result);
    for (var j = 0; j < previousPlayers.length; j++) {
        prevTemp += parseFloat(previousPlayers[j].PER)
    }
    prevTemp = parseFloat(prevTemp) / previousPlayers.length;

    for (var j = 0; j < currentPlayers.length; j++) {
        currTemp += parseFloat(currentPlayers[j].PER)
    }
    currTemp = parseFloat(currTemp) / currentPlayers.length;
    result = parseFloat(currTemp) - parseFloat(prevTemp);

    //console.log(result)
    return result;
}
