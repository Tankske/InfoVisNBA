//Preprocessed min max values for players from 1985-2015
var minMaxPEROnePlayer = [-16.6,35.3];
var minMaxAgeOnePlayer = [18,43];
//var minMaxEFGPercentageOnePlayer = [0,1];
//var minMaxORtgOnePlayer = [15,175];
//var minMaxDRtgOnePlayer = [78,120];
//Self chosen values
var minMaxEFGPercentageOnePlayer = [0.35,0.65];
var minMaxORtgOnePlayer = [90,135];
var minMaxDRtgOnePlayer = [90,135];

var shirtWidth = 50;
var shirtHeight = 70;

var minWidthShirt = 34.75;
var maxWidthShirt = 87.93;
var minHeightShirt = minWidthShirt*shirtHeight/shirtWidth;
var maxHeightShirt = maxWidthShirt*shirtHeight/shirtWidth;

var minShirtScale = minWidthShirt/shirtWidth;
var maxShirtScale = maxWidthShirt/shirtWidth;

function showPlayerInfo(d) {
    pi = d3.select("#playerinfo");
    pi.select("#playername").text(d["Player"]);
    pi.select("#playerper").text("PER: " +  d3.format(".1f")(d.advanced["PER"]));
    pi.select("#playerefg").text("eFG%: " + d3.format(".1%")(d.totals["eFG%"]));
    pi.select("#playerortg").text("ORtg: " + d3.format(".0f")(d.perposs["ORtg"]));
    pi.select("#playerdrtg").text("DRtg: " + d3.format(".0f")(d.perposs["DRtg"]));
    //pi.select("#playerheight").text("Height: " + d["Ht"]);
    //pi.select("#playerweight").text("Weight: " + d["Wt"]);
    pi.select("#playerbirthday").text("Birthday: " + d["Birth Date"]);
}

function clearPlayerInfo() {
    d3.select("#playerinfo").selectAll("p").text("");
    d3.select("#playerinfo").selectAll("h2").text("");
}

//var perScale = d3.scale.linear()
//                    .range([0.3, 3])
//                    .domain([0, 1600]);

//function exagerratedPerScale(per) {
//    var exagerratedPer = Math.pow(per, 1.5);
//    if (per < 0) { exagerratedPer = 0; }
//    return perScale(exagerratedPer);
//}

function drawF(data, team, year, svg, x, y, width, height, stat, scaler) {
    players = data.find(function (d) {
            return d.year === year;
        })
        .teams.find(function (d) {
            return d.team === team;
        })
        .players;

    players.sort(function (a, b) {
        if (stat(a) > stat(b)) {
            return -1;
        } else if (stat(a) < stat(b)) {
            return 1;
        } else {
            return 0;
        }
    });

    d3.selectAll(".fieldchart").remove();


    svg.append("g")
        .attr("class", "chart fieldchart")
        .append("image")
        .attr("xlink:href", "img/court2.png")
        .attr("x", x)
        .attr("y", y)
        .attr("width", width)
        .attr("height", height)
        .attr("preserveAspectRatio", "none");

    var chart = svg
        .append("g")					//Append one div to the selected div in which we will construct the visualisation. This is done to separate mutliple visualisations..
        .attr("class", "chart fieldchart")
        .attr("width", width)
        .attr("height", height);

    var backs = chart.append("g")
        .attr("class", "backs")
        .attr("width", width)
        .attr("height", height);

    var tipPosition = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + d + " </strong>";
        });
    chart.call(tipPosition);

    var alreadyOn = {
        SG: {before: 0, xpos: 0.4 * width, ypos: 0.2 * height, fullname: "Shooting Guard"}
        , PF: {before: 0, xpos: 0.05 * width, ypos: 0.9 * height - 100, fullname: "Power Forward"}
        , C: {before: 0, xpos: 0.7 * width, ypos: 0.5 * height - 50, fullname: "Center"}
        , PG: {before: 0, xpos: 0.4 * width, ypos: 0.8 * height - 100, fullname: "Point Guard"}
        , SF: {before: 0, xpos: 0.05 * width, ypos: 0.05 * height, fullname: "Small Forward"}
    };

    for (var posName in alreadyOn) {


        backs.append("rect")
            .attr("x", alreadyOn[posName].xpos - 25)
            .attr("y", alreadyOn[posName].ypos - width / 50)
            .attr("width", 20)
            .attr("height", 0)
            .attr("class", "posrect")
            .attr("fill", "#D8D8D8")
            .style("fill-opacity", 0.4)
            .attr("id", "posrect" + posName)
            .on('mouseenter', function () {
                var thisPosName = this.id.replace(/posrect/, '');
                d3.select("#posrect" + thisPosName).style("fill", "black");
                tipPosition.show(alreadyOn[thisPosName].fullname);

            })
            .on('mouseleave', function () {
                var thisPosName = this.id.replace(/posrect/, '');
                d3.select("#posrect" + thisPosName).style("fill", "D8D8D8");
                tipPosition.hide();
            });

        backs.append("text")
            .attr("class", "posname")
            .attr("x", alreadyOn[posName].xpos - 20)
            .attr("y", alreadyOn[posName].ypos)
            .attr("font-size", width / 50 + "px")
            .text(posName);
    }

    for (i = 0; i < players.length; i++) {
        var pos = players[i].Pos;
        var wh = drawScaledShirt(alreadyOn[pos].xpos + alreadyOn[pos].before,
            alreadyOn[pos].ypos,
            players[i],
            team,
            chart,
            scaler(stat(players[i])));
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
        rectHeight += width / 50 + 10;
        d3.select("#posrect" + pos)
            .attr("width", rectWidth)
            .attr("height", rectHeight);
    }
}

function scaleShirtPer(per) {
	var result = exagerratedPerScaleShirt(per, minMaxPEROnePlayer[0], minMaxPEROnePlayer[1], minShirtScale, maxShirtScale);
	return result;	
}

function scaleShirtDRtg(dRtg) {
	var result = perceptionScaleShirt(dRtg, minMaxDRtgOnePlayer[0], minMaxDRtgOnePlayer[1], minShirtScale, maxShirtScale);
	return result;	
}

function scaleShirtORtg(oRtg) {
	var result = perceptionScaleShirt(oRtg, minMaxORtgOnePlayer[0], minMaxORtgOnePlayer[1], minShirtScale, maxShirtScale);
	return result;	
}

function scaleShirtEFGP(efgp) {
	var result = perceptionScaleShirt(efgp, minMaxEFGPercentageOnePlayer[0], minMaxEFGPercentageOnePlayer[1], minShirtScale, maxShirtScale);
	return result;	
}

function scaleShirtAge(age) {
	var result = perceptionScaleShirt(age, minMaxAgeOnePlayer[0], minMaxAgeOnePlayer[1], minShirtScale, maxShirtScale);
	return result;	
}

function exagerratedPerScaleShirt(value, minValue, maxValue, minRange, maxRange) {
    
	if (value < 0) { value = 0; }
	if (minValue < 0) { minValue = 0; }
	var newMaxSide = Math.pow(maxValue, 1.5);
    var newMinSide = Math.pow(minValue, 1.5);
    var newValueSide = Math.pow(value, 1.5);
    var result = d3.scale.linear().clamp(true).range([minRange,maxRange]).domain([newMinSide,newMaxSide])(newValueSide);

    return result;
}

function perceptionScaleShirt(value, minValue, maxValue, minRange, maxRange) {
    
	var adjustedMinValue = minValue;
	var adjustedMaxValue = maxValue;
	var adjustedValue = value;
	
	if (minValue <= 0) {
		//Get rid of negative values
    var adjustedMinValue = minValue - minValue +1;
    var adjustedMaxValue = maxValue - minValue +1;
    var adjustedValue = value - minValue +1;
	}
	
	
    var newMaxSide = 1.0083 * Math.pow((adjustedMaxValue/adjustedMinValue),0.5716) * minRange;
    var newMinSide = 1.0083 * Math.pow((adjustedMinValue/adjustedMinValue),0.5716) * minRange;
    var newValueSide = 1.0083 * Math.pow((adjustedValue/adjustedMinValue),0.5716) * minRange;

    var result = d3.scale.linear().clamp(true).range([minRange,maxRange]).domain([newMinSide,newMaxSide])(newValueSide);

    return result;
}

function drawScaledShirt(xPos, yPos, player, team, chart, scale) {
    team = fixteamname(team);
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


    playerShirt.append("path")
        .attr("d", "M 0," + (25 * scale) + " A " + (8 * scale) + "," + (20 * scale) + " 0 0,0 " + (7.94 * scale) + ",0 H " + ((25 - 8) * scale) +
            " A " + (8 * scale) + "," + (8 * scale) + " 0 1,0 " + ((25 + 8) * scale) + ",0 H " + ((50 - 7.94) * scale) +
            " A " + (8 * scale) + "," + (20 * scale) + " 0 0,0 " + (50 * scale) + "," + (25 * scale) + " V " + (70 * scale) + " H -" + (50 * scale) + " Z")
        .attr("fill", shirtColor);

    playerShirt.append("path")
        .attr("d", "M 0," + (25 * scale) + " A " + (8 * scale) + "," + (20 * scale) + " 0 0,0 " + (7.94 * scale) + ",0")
        .attr("stroke-width", 2 * scale)
        .attr("fill", "none")
        .attr("stroke", shirtEdge);

    playerShirt.append("path")
        .attr("d", "M " + ((25 - 8) * scale) + ",0 A " + (8 * scale) + "," + (8 * scale) + " 0 1,0 " + ((25 + 8) * scale) + ",0")
        .attr("stroke-width", 2 * scale)
        .attr("fill", "none")
        .attr("stroke", shirtEdge);

    playerShirt.append("path")
        .attr("d", "M " + ((50 - 7.94) * scale) + ",0 A " + (8 * scale) + "," + (20 * scale) + " 0 0,0 " + (50 * scale) + "," + (25 * scale))
        .attr("stroke-width", 2 * scale)
        .attr("fill", "none")
        .attr("stroke", shirtEdge);

    //playerShirt.append("rect")
    //    //                    .attr("shape-rendering", "crispEdges")
    //    .attr("width", 50 * scale)
    //    .attr("height", 70 * scale)
    //    .attr("fill", shirtColor);
    //
    //
    //
    //playerShirt.append("ellipse")
    //    //                    .attr("shape-rendering", "crispEdges")
    //    .attr("fill", "white")
    //    .attr("rx", 8 * scale)
    //    .attr("ry", 20 * scale)
    //    .attr("cy", 5 * scale)
    //    .attr("cx", 0)
    //    .attr("stroke-width", 2 * scale)
    //    .attr("stroke", shirtEdge);
    //
    //playerShirt.append("ellipse")
    //    //                    .attr("shape-rendering", "crispEdges")
    //    .attr("fill", "white")
    //    .attr("rx", 8 * scale)
    //    .attr("ry", 20 * scale)
    //    .attr("cy", 5 * scale)
    //    .attr("cx", 50 * scale)
    //    .attr("stroke-width", 2 * scale)
    //    .attr("stroke", shirtEdge);
    //
    //playerShirt.append("ellipse")
    //    //                    .attr("shape-rendering", "crispEdges")
    //    .attr("fill", "white")
    //    .attr("rx", 8 * scale)
    //    .attr("ry", 8 * scale)
    //    .attr("cy", 0 * scale)
    //    .attr("cx", 25 * scale)
    //    .attr("stroke-width", 2 * scale)
    //    .attr("stroke", shirtEdge);

    playerShirt.append("text")
        .attr("id", (player.Player.split(" ")).pop())
        .attr("x", 10 * scale)
        .attr("y", 25 * scale)
        .attr("textLength", 30 * scale)
        .attr("lengthAdjust", "spacingAndGlyphs")
        .attr("fill", "#ffffff")
        .attr("font-size", 10 * scale + "px")
        .text((player.Player.split(" ")).pop());

    playerShirt.append("text")
        .attr("id", (player.Player.split(" ")).pop() + "number")
        .attr("x", 25 * scale)
        .attr("y", 55 * scale)
        .attr("text-anchor", "middle")
        .attr("textLength", 25 * scale)
        .attr("lengthAdjust", "spacing")
        .attr("fill", "#ffffff")
        .attr("font-family", "Helvetica")
        .attr("font-weight", "bold")
        .attr("font-size", 25 * scale + "px")
        .text(parseFloat(player['No.']).toFixed(0));

    playerShirt.on('mouseover', function (d) {
        showPlayerInfo(player);
    });
    playerShirt.on('mouseout', function () {
        clearPlayerInfo();
    });

    return {width: 50 * scale, height: 70 * scale};
//return playerShirt;
}
