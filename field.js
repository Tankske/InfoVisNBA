function drawF(data, team, year, svg, x, y, width, height) {
    players = data.find(function(d) {return d.year === year;})
                .teams.find(function(d) {return d.team === team;})
                .players;

    players.sort(function (a, b) {
        if (a.advanced.PER > b.advanced.PER) {
            return -1;
        } else if (a.advanced.PER < b.advanced.PER) {
            return 1;
        } else {
            return 0;
        }
    });

    d3.selectAll(".fieldchart").remove();


    svg.append("g")
        .attr("class", "chart fieldchart")
        .append("image")
        .attr("xlink:href", "img/court.png")
        .attr("x", x)
        .attr("y", y)
        .attr("width", width)
        .attr("height", height)
        .attr("preserveAspectRatio", "none");

    var chart = svg
                .append("g")					//Append one div to the selected div in which we will construct the visualisation. This is done to separate mutliple visualisations..
                .attr("class","chart fieldchart")
                .attr("width", width)
                .attr("height", height);

    var backs = chart.append("g")
        .attr("class", "backs")
        .attr("width", width)
        .attr("height", height);
    
    perScale = d3.scale.linear()
                    .range([0.3, 3])
                    .domain([0, 1600]);

    var alreadyOn = {SG: {before: 0, xpos: 0.4 * width, ypos: 0.2 * height}
                    ,PF: {before: 0, xpos: 0.05 * width, ypos: 0.9 * height - 100}
                    ,C: {before: 0, xpos: 0.7 * width, ypos: 0.5 * height - 50}
                    ,PG: {before: 0, xpos: 0.4 * width, ypos: 0.8 * height - 100}
                    ,SF: {before: 0, xpos: 0.05 * width, ypos: 0.05 * height}
                    ,'S-G': {before: 0, xpos: 10000, ypos: 600}};

    for (var posName in alreadyOn) {
        backs.append("rect")
            .attr("x",alreadyOn[posName].xpos - 25)
            .attr("y",alreadyOn[posName].ypos - width/50)
            .attr("width", 20)
            .attr("height", 0)
            .attr("class", "posrect")
            .attr("fill", "white")
            .attr("id", "posrect" + posName);

        backs.append("text")
            .attr("class", "posname")
            .attr("x",alreadyOn[posName].xpos - 20)
            .attr("y",alreadyOn[posName].ypos)
            .attr("font-size", width/50 + "px")
            .text(posName);
    }

    for (i = 0; i < players.length; i++) {
        var pos = players[i].Pos;
        var exagerratedPer = Math.pow(players[i].advanced.PER, 2);
        if (players[i].advanced.PER < 0) { exagerratedPer = 0; }
        var wh = drawScaledShirt(alreadyOn[pos].xpos + alreadyOn[pos].before,
                        alreadyOn[pos].ypos, 
                        players[i].Player, 
                        players[i]['No.'], 
                        team, 
                        chart, 
                        perScale(exagerratedPer));
        alreadyOn[pos].before += wh.width + 10;
        var rectWidth = Number(d3.select("#posrect" + pos).attr("width"));
        var rectHeight = Number(d3.select("#posrect" + pos).attr("height"));
        rectWidth += wh.width + 10;
        rectHeight = Math.max(rectHeight, wh.height);
        d3.select("#posrect" + pos)
            .attr("width", rectWidth)
            .attr("height", rectHeight);
    }

    for (var pos in alreadyOn) {
        var rectWidth = Number(d3.select("#posrect" + pos).attr("width"));
        var rectHeight = Number(d3.select("#posrect" + pos).attr("height"));
        rectWidth += 10;
        rectHeight += width/50 + 10;
        d3.select("#posrect" + pos)
            .attr("width", rectWidth)
            .attr("height", rectHeight);
    }
}

function drawScaledShirt(xPos, yPos, name, number, team, chart, scale) {
    team = team.replace(/\s+/g, '');
    var shirtColor = ShirtColors[team].shirt;
    var shirtEdge = ShirtColors[team].edge;
//                if (shirtColor)
//console.log("test" + shirtColor);
//                console.log(shirtEdge);
    var playerShirt = chart.append("svg")
        .attr("viewbox", "0, 0, " + 50 * scale + ", " + 70 * scale)
        .attr("overflow", "hidden")
        .attr("x", xPos)
        .attr("y", yPos)
        .attr("width", 50 * scale)
        .attr("height", 70 * scale)
        .append("g")
        .attr("position", "absolute")
        .attr("class", "shirt");
//
//                    .attr("width", (width/2-margin.right-margin.left)/3)
//                    .attr("height", (width/2-margin.right-margin.left)*7/15);

    playerShirt.append("rect")
        //                    .attr("shape-rendering", "crispEdges")
        .attr("width", 50 * scale)
        .attr("height", 70 * scale)
        .attr("fill", shirtColor);



    playerShirt.append("ellipse")
        //                    .attr("shape-rendering", "crispEdges")
        .attr("fill", "white")
        .attr("rx", 8 * scale)
        .attr("ry", 20 * scale)
        .attr("cy", 5 * scale)
        .attr("cx", 0)
        .attr("stroke-width", 2 * scale)
        .attr("stroke", shirtEdge);

    playerShirt.append("ellipse")
        //                    .attr("shape-rendering", "crispEdges")
        .attr("fill", "white")
        .attr("rx", 8 * scale)
        .attr("ry", 20 * scale)
        .attr("cy", 5 * scale)
        .attr("cx", 50 * scale)
        .attr("stroke-width", 2 * scale)
        .attr("stroke", shirtEdge);

    playerShirt.append("ellipse")
        //                    .attr("shape-rendering", "crispEdges")
        .attr("fill", "white")
        .attr("rx", 8 * scale)
        .attr("ry", 8 * scale)
        .attr("cy", 0 * scale)
        .attr("cx", 25 * scale)
        .attr("stroke-width", 2 * scale)
        .attr("stroke", shirtEdge);

    playerShirt.append("text")
        .attr("id", (name.split(" ")).pop())
        .attr("x", 10 * scale)
        .attr("y", 25 * scale)
        .attr("textLength", 30 * scale)
        .attr("lengthAdjust", "spacingAndGlyphs")
        .attr("fill", "#ffffff")
        .attr("font-size", 10 * scale + "px")
        .text((name.split(" ")).pop());

    playerShirt.append("text")
        .attr("id", (name.split(" ")).pop() + "number")
        .attr("x", 25 * scale)
        .attr("y", 55 * scale)
        .attr("text-anchor", "middle")
        .attr("textLength", 25 * scale)
        .attr("lengthAdjust", "spacing")
        .attr("fill", "#ffffff")
        .attr("font-family", "Helvetica")
        .attr("font-weight", "bold")
        .attr("font-size", 25 * scale + "px")
        .text(number);

    return { width: 50 * scale, height: 70 * scale };
    //return playerShirt;
}
