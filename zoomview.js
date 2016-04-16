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

    console.log(teamWanted, yearWanted, arrowVariable);
    d3.select(".zoomchart").remove();

    var margin = {top: 0, right: 0, bottom: 0, left: 0};

    var previousPlayers = [],
            currentPlayers = [],
            arrayPlayers = [],
            teamSRS = 0;
//                minMax = [];


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
        .attr("d", "M 0,0 h 100 v -10 l 15,20 h -115 z")
        .attr("id", "transferArrowIn")
        .attr("class", "arrowIn");

    defs.append("path")
        .attr("d", "M 0,0 l 15,20 v -10 h 100 v -10 z")
        .attr("id", "transferArrowOut")
        .attr("class", "arrowOut");

    defs.append("path")
        .attr("d", "M -5,0 v -35 h -10 l 15,-20 l 15,20 h -10 v 85 h -10 z")
        .attr("id", "transferArrowStayedUp")
        .attr("class", "arrowStayedUp");
    defs.append("path")
        .attr("d", "M -5,0 v 35 h -10 l 15,20 l 15,-20 h -10 v -85 h -10 z")
        .attr("id", "transferArrowStayedDown")
        .attr("class", "arrowStayedDown");


//        var shirt = defs.append("pattern")
//                .attr("id", "shirt")
//                .attr("overflow", "hidden")
//                .attr("width", 1)
//                .attr("height", 1);;
////                    .attr("width", (width/2-margin.right-margin.left)/3)
////                    .attr("height", (width/2-margin.right-margin.left)*7/15);
//
//        shirt.append("rect")
////                    .attr("shape-rendering", "crispEdges")
//                .attr("x", 0)
//                .attr("y", 0)
//                .attr("width", 50)
//                .attr("height", 70)
//                .attr("fill", "#0000ff");
//
//
//
//        shirt.append("ellipse")
////                    .attr("shape-rendering", "crispEdges")
//                .attr("fill", "white")
//                .attr("rx", 8)
//                .attr("ry", 20)
//                .attr("cy", 5)
//                .attr("cx", 0)
//                .attr("stroke-width", 2)
//                .attr("stroke", "#ffd700");
//
//        shirt.append("ellipse")
////                    .attr("shape-rendering", "crispEdges")
//                .attr("fill", "white")
//                .attr("rx", 8)
//                .attr("ry", 20)
//                .attr("cy", 5)
//                .attr("cx", 50)
//                .attr("stroke-width", 2)
//                .attr("stroke", "#ffd700");
//
//        shirt.append("ellipse")
////                    .attr("shape-rendering", "crispEdges")
//                .attr("fill", "white")
//                .attr("rx", 8)
//                .attr("ry", 8)
//                .attr("cy", 0)
//                .attr("cx", 25)
//                .attr("stroke-width", 2)
//                .attr("stroke", "#ffd700");
//
//
//        function drawShirt(xPos, yPos, name, number, team) {
//            var playerShirt = chart.append("g");
//
//            playerShirt.append("rect")
//                    .attr("x", xPos)
//                    .attr("y", yPos)
//                    .attr("height", 70)
//                    .attr("width", 50)
//                    .attr("fill", "url(#shirt)");
//            playerShirt.append("text")
//                    .attr("id", (name.split(" ")).pop())
//                    .attr("x", (xPos + 10))
//                    .attr("y", (yPos + 25))
//                    .attr("textLength", 30)
//                    .attr("lengthAdjust", "spacingAndGlyphs")
//                    .attr("fill", "#ffffff")
//                    .text((name.split(" ")).pop());
//
//            playerShirt.append("text")
//                    .attr("id", (name.split(" ")).pop() + "number")
//                    .attr("x", (xPos + 25))
//                    .attr("y", (yPos + 55))
//                    .attr("text-anchor", "middle")
//                    .attr("textLength", 25)
//                    .attr("lengthAdjust", "spacing")
//                    .attr("fill", "#ffffff")
//                    .attr("font-family", "Helvetica")
//                    .attr("font-weight", "bold")
//                    .attr("font-size", "25px")
//                    .text(number);
//        }

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


    var arrowIncoming = chart.append('g')
            .attr('id', 'incoming');

    var rad = radius(teamSRS);

    chart.append('g')
            .attr('class', 'circleTeam')
            .append("circle")
            .attr("class", "teambubblezoom")
            .attr("cx", (width/2 + rad)) //arrow heigth is half of the width
            .attr("cy", height/2)
            .attr("r", rad )




    var arrowStayed = chart.append('g')
            .attr('id', 'stayed')

    var arrowOutgoing = chart.append('g')
            .attr('id', 'outgoing')







        var scaleIn = scaleFactor(arrayPlayers, margin.left, (width/2-margin.right));
        var widthVariable = 5;

        arrowIncoming.append("use")
                .attr("xlink:href","#transferArrowIn")
                .attr('transform', function(d) {
                    return "translate(" + margin.left + ", " +  (height / 2 - height/50 - 20*widthVariable/2) + ") scale(" + (scaleIn[0]/115) + ", " + widthVariable + ")";
                });

        arrowIncoming.append('text')
            .attr("x", scaleIn[0]/2 + margin.left)
            .attr("y", (height / 2 - 10 - 20*widthVariable/4))
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text("" + totalPER(arrayPlayers[0]).toFixed(1));




        arrowOutgoing.append("use")
                .attr("xlink:href","#transferArrowOut")
                .attr('transform', function(d) {
                    return "translate(" + margin.left + ", " +  (height / 2 + height/50) + ") scale(" + (scaleIn[1]/115) + ", " + widthVariable + ")";
                });

        arrowOutgoing.append('text')
                .attr("x", scaleIn[1]/2 + margin.left)
                .attr("y", (height / 2 + height/50 + 20*widthVariable/4))
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .text("" + totalPER(arrayPlayers[3]).toFixed(1));

        var stayedPer = parseFloat(totalPER(arrayPlayers[2])) - parseFloat(totalPER(arrayPlayers[1]))
        if (parseFloat(stayedPer) >= 0) {
            arrowStayed.append("use")
                .attr("xlink:href","#transferArrowStayedUp")
                .attr('transform', function(d) {
                    return "translate(" + (width/2 + margin.left) + ", " +  (height/2) + ") scale(" + (scaleIn[1]/115) + ", " + (scaleIn[1]/115) + ")";
                });
        }
        else if(parseFloat(stayedPer) < 0) {
            arrowStayed.append("use")
                .attr("xlink:href","#transferArrowStayedDown")
                .attr('transform', function(d) {
                    return "translate(" + (width/2 + margin.left) + ", " +  (height/2) + ") scale(" + (scaleIn[1]/115) + ", " + (scaleIn[1]/115) + ")";
                });
        }

        arrowStayed.append('text')
            .attr("x", (width/2 + margin.left))
            .attr("y", height/2)
            .attr("dx", 20)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(stayedPer.toFixed(1));

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


//TODO Team en players doorgeven is niet zo goed. Twee keer zelfde methode op positie na.
    function incomingShirts(players) {
        var bestPlayers = bestTwoPlayers(players);
        var h = (height / 2 - height/50 - widthVariable*20 - 35)
        if (bestPlayers.length >= 1) {
            drawShirt(10, h, bestPlayers[0].Player, bestPlayers[0]["No."], teamWanted);
            if (bestPlayers.length >= 2) {
                drawShirt(100, h, bestPlayers[1].Player, bestPlayers[1]["No."], teamWanted);
            }
        }
//                console.log( bestPlayers[0].Player, bestPlayers[0]["No."],bestPlayers[1].Player, bestPlayers[1]["No."])
    }

    function outgoingShirts(players) {
        var bestPlayers = bestTwoPlayers(players);
        var h = (height / 2 + height/50 + widthVariable*20 - 35);
        if (bestPlayers.length >= 1) {
            drawShirt(10, h, bestPlayers[0].Player, bestPlayers[0]["No."], teamWanted);
            if (bestPlayers.length >= 2) {
                drawShirt(100, h, bestPlayers[1].Player, bestPlayers[1]["No."], teamWanted);
            }
        }
//                console.log( bestPlayers[0].Player, bestPlayers[0]["No."],bestPlayers[1].Player, bestPlayers[1]["No."])
    }

    function stayedShirts(playersOld, playersNew) {
        var players = playerPERDifference(playersOld, playersNew);
        var bestPlayers = bestTwoPlayers(players);
        if (bestPlayers.length >= 1) {
            drawShirt((width/2 + rad), height/2, bestPlayers[0].Player, bestPlayers[0]["No."], teamWanted);
            if (bestPlayers.length >= 2) {
                drawShirt((width/2 + rad + 80), height/2, bestPlayers[1].Player, bestPlayers[1]["No."], teamWanted);
            }
        }
    }


    incomingShirts(arrayPlayers[0]);
    console.log(incomingShirts(arrayPlayers[0]));
    outgoingShirts(arrayPlayers[3]);
    stayedShirts(arrayPlayers[1], arrayPlayers[2]);

    PERChangesPosition(previousPlayers,currentPlayers, "pg");
    PERChangesPosition(previousPlayers,currentPlayers, "pf");
    PERChangesPosition(previousPlayers,currentPlayers, "sg");
    PERChangesPosition(previousPlayers,currentPlayers, "sf");
    PERChangesPosition(previousPlayers,currentPlayers, "c");




}




function radius(radiusVariable) {
    return (11 + radiusVariable)*7 * (width / 1000) ;
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

    console.log(result)
    return result;
}
