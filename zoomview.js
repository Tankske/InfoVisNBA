function drawTransfers(inData, teamWanted, yearWanted, arrowVariable, svg, xpos, ypos, w, h) {
    console.log(teamWanted, yearWanted, arrowVariable);

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

    defs.append("marker")
            .attr("id", "markerPlus")
            .attr("markerHeight", 2)
            .attr("markerWidth", 2)
//                .attr('markerUnits', 'strokeWidth')
            .attr("orient", "auto")
            .attr("refX", -1)
            .attr("refY", 0)
            .attr("viewBox", "-5 -5 10 10")
            .append("path")
            .attr("d", "M -1,-2 L 1,0 L -1,2 Z")
            .attr("class", "arrowIn");

    defs.append("marker")
            .attr("id", "markerMin")
            .attr("markerHeight", 20)
            .attr("markerWidth", 2)
            //                .attr('markerUnits', 'strokeWidth')
            .attr("orient", "auto")
            .attr("refX", -1)
            .attr("refY", 0)
            .attr("viewBox", "-5 -5 10 10")
            .append("path")
            .attr("d", "M -1,-2 L 1,0 L -1,2 Z")
            .attr("class", "arrowOut");

    defs.append("path")
            .attr("d", "M 0,0 h 100 v -10 l 15,20 h -115 z")
            .attr("id", "transferArrowIn")
            .attr("class", "arrowIn");

    defs.append("path")
            .attr("d", "M 0,0 l 15,20 v -10 h 100 v -10 z")
            .attr("id", "transferArrowOut")
            .attr("class", "arrowOut");


        var shirt = defs.append("pattern")
                .attr("id", "shirt")
                .attr("overflow", "hidden")
                .attr("width", 1)
                .attr("height", 1);;
//                    .attr("width", (width/2-margin.right-margin.left)/3)
//                    .attr("height", (width/2-margin.right-margin.left)*7/15);

        shirt.append("rect")
//                    .attr("shape-rendering", "crispEdges")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 50)
                .attr("height", 70)
                .attr("fill", "#0000ff");



        shirt.append("ellipse")
//                    .attr("shape-rendering", "crispEdges")
                .attr("fill", "white")
                .attr("rx", 8)
                .attr("ry", 20)
                .attr("cy", 5)
                .attr("cx", 0)
                .attr("stroke-width", 2)
                .attr("stroke", "#ffd700");

        shirt.append("ellipse")
//                    .attr("shape-rendering", "crispEdges")
                .attr("fill", "white")
                .attr("rx", 8)
                .attr("ry", 20)
                .attr("cy", 5)
                .attr("cx", 50)
                .attr("stroke-width", 2)
                .attr("stroke", "#ffd700");

        shirt.append("ellipse")
//                    .attr("shape-rendering", "crispEdges")
                .attr("fill", "white")
                .attr("rx", 8)
                .attr("ry", 8)
                .attr("cy", 0)
                .attr("cx", 25)
                .attr("stroke-width", 2)
                .attr("stroke", "#ffd700");


        function drawShirt(xPos, yPos, name, number, team) {
            var playerShirt = chart.append("g")

            playerShirt.append("rect")
                    .attr("x", xPos)
                    .attr("y", yPos)
                    .attr("height", 70)
                    .attr("width", 50)
                    .attr("fill", "url(#shirt)");
            playerShirt.append("text")
                    .attr("id", (name.split(" ")).pop())
                    .attr("x", (xPos + 10))
                    .attr("y", (yPos + 25))
                    .attr("textLength", 30)
                    .attr("lengthAdjust", "spacingAndGlyphs")
                    .attr("fill", "#ffffff")
                    .text((name.split(" ")).pop());

            playerShirt.append("text")
                    .attr("id", (name.split(" ")).pop() + "number")
                    .attr("x", (xPos + 25))
                    .attr("y", (yPos + 55))
                    .attr("text-anchor", "middle")
                    .attr("textLength", 25)
                    .attr("lengthAdjust", "spacing")
                    .attr("fill", "#ffffff")
                    .attr("font-family", "Helvetica")
                    .attr("font-weight", "bold")
                    .attr("font-size", "25px")
                    .text(number);
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



        chart.append("path")
                .attr("d", "M 0,"  + height/2 + " h 1000")
                .attr("stroke", "black")
                .attr("stroke-width", 1);


//TODO Team en players doorgeven is niet zo goed.
        function incomingShirts(players, team) {
            var bestPlayers = bestTwoPlayers(players);
            if (bestPlayers.length >= 1) {
                drawShirt(xpos + 10, ypos + 10, bestPlayers[0].Player, bestPlayers[0]["No."], team);
                if (bestPlayers.length >= 2) {
                    drawShirt(xpos + 100, ypos + 10, bestPlayers[1].Player, bestPlayers[1]["No."], team);
                }
            }
//                console.log( bestPlayers[0].Player, bestPlayers[0]["No."],bestPlayers[1].Player, bestPlayers[1]["No."])
        }

        function outgoingShirts(players, team) {
            var bestPlayers = bestTwoPlayers(players);
            if (bestPlayers.length >= 1) {
                drawShirt(xpos + 10, ypos + 300, bestPlayers[0].Player, bestPlayers[0]["No."], team);
                if (bestPlayers.length >= 2) {
                    drawShirt(xpos + 100, ypos + 300, bestPlayers[1].Player, bestPlayers[1]["No."], team);
                }
            }
//                console.log( bestPlayers[0].Player, bestPlayers[0]["No."],bestPlayers[1].Player, bestPlayers[1]["No."])
        }


        incomingShirts(arrayPlayers[0], "Golden State Warriors");
        outgoingShirts(arrayPlayers[3], "Golden State Warriors");








        //        arrowIncoming.append('path')
//                .attr("class", "arrowIn")
////                .attr('d', function(d){ return 'M ' + margin.left + ', ' + height/2 + ' L ' + (width/2 - radius(20) - margin.right) + ',' + height/2 + ' L ' + (width/2 - radius(20) - margin.right) + ',' + (height/2-totalPER(arrayPlayers[0])/20) + ' L ' + (width/2 - radius(20) - margin.right + totalPER(arrayPlayers[0])/20) + ',' + height/2 + ' z'})
//                .attr('d', function(d){ return 'M ' + margin.left + ', ' + height/2 + ' L ' + (width/2 - radius(20) - margin.right) + ',' + height/2 + '' })
//                .attr('stroke-width', totalPER(arrayPlayers[0]))
//                .attr('marker-end',"url(#markerPlus)");
//
//        arrowIncoming.append('text')
//                .attr("x", (width/2-radius(20))/2)
//                .attr("y", height/2)
//                .attr("dy", ".35em")
//                .attr("text-anchor", "middle")
//                .text("" + totalPER(arrayPlayers[0]).toFixed(1));
//        arrowOutgoing.append('path')
//                .attr("class", "arrowOut")
////                .attr('d', function(d){ return 'M ' + (width/2 + radius(20) + margin.left) + ', ' + height/2 + ' L ' + (width - margin.right) + ',' + height/2 + ' L ' + (width - margin.right) + ',' + (height/2+totalPER(arrayPlayers[3])/20) + ' L ' + (width - margin.right + totalPER(arrayPlayers[3])/20) + ',' + height/2 + ' z'})
//                .attr('d', function(d){ return 'M ' + (width/2 + radius(20) + margin.left) + ', ' + height/2 + ' L ' + (width - margin.right) + ',' + height/2 + '' })
//                .attr('stroke-width', totalPER(arrayPlayers[3]))
//                .attr('marker-end', "url(#markerMin)");
//
//        arrowOutgoing.append('text')
//                .attr("x", (width-(width/2-radius(20))/2))
//                .attr("y", height/2)
//                .attr("dy", ".35em")
//                .attr("text-anchor", "middle")
//                .text("" + totalPER(arrayPlayers[2]).toFixed(1));
//        arrowStayed.append('path')
//                .attr("class", "arrowStayed")
////                .attr('d', function(d){ return 'M ' + (width/2 - (1/4*radius(20))) + ', ' + (height/2 + 3/4*radius(20)) + ' L ' + (width/2 - (1/4*radius(20))) + ',' + (height/2 - 3/4*radius(20)) + '' })
//                .attr('d', function(d){ return 'M ' + (width/2 - (1/4*radius(20))) + ', ' + (height/2 + 3/4*radius(20)) + ' L ' + (width/2 - (1/4*radius(20))) + ',' + (height/2 - 3/4*radius(20)) + '' })
//                .attr('stroke-width', totalPER(arrayPlayers[2])- totalPER(arrayPlayers[1]))
//                .attr('marker-end', "url(#markerPlus)");


//        arrowStayed.append('text')
//                .attr("x", (width/2 - (1/4*radius(20))))
//                .attr("y", height/2)
//                .attr("dx", 20)
//                .attr("dy", ".35em")
//                .attr("text-anchor", "middle")
//                .text((totalPER(arrayPlayers[2])- totalPER(arrayPlayers[1])).toFixed(1));

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
        total += parseFloat(players[i].PER);
    }
    return total;
}

function minMaxPerSeason(data, yearWanted) {
    var previousPlayersArray = [],
            currentPlayersArray = [],
            playersArray = [],
            minMaxInOutStay = [2000, 0, 2000, 0, 2000, 0];

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

function bestTwoPlayers(players) {
    var result = [],
            max1 = 0,
            max2 = 0;
    for (var i = 0; i<players.length; i++) {
        if (parseFloat(players[i].PER) > parseFloat(max1)) {

            max2 = max1;
            max1 = players[i].PER;
            result[1] = result[0];
            result[0] = players[i];
        }
        else if (parseFloat(players[i].PER) > parseFloat(max2)) {
            max2 = players[i].PER;
            result[1] = players[i];
        }
    }
    return result;
}
