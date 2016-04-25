function drawLegend(){
		var legende = d3.select("#legende").append('svg')
							.attr("width", '500px')
					
		legende.append('circle')
					.attr("r", 10)
					.attr("cx", 30)
					.attr("cy", 30)
					.style("fill", d3.rgb(255,255,255))		    			
			    	.style("stroke-width", 5)
			    	.attr("stroke", 'gold');

		legende.append('text')
					.attr('dx', 50)
					.attr('dy', 33)
					.text('Team won gold medal')

		legende.append('circle')
					.attr("r", 10)
					.attr("cx", 30)
					.attr("cy", 60)
					.style("fill", d3.rgb(255,255,255))		    			
			    	.style("stroke-width", 5)
			    	.attr("stroke", 'silver');

		legende.append('text')
					.attr('dx', 50)
					.attr('dy', 63)
					.text('Team won silver medal')

		legende.append('circle')
					.attr("r", 10)
					.attr("cx", 30)
					.attr("cy", 90)
					.style("fill", d3.rgb(255,255,255))		    			
			    	.style("stroke-width", 5)
			    	.attr("stroke", '#D3782F');

		legende.append('text')
					.attr('dx', 50)
					.attr('dy', 93)
					.text('Team won bronze medal in conference')

		legende.append('circle')
					.attr("r", 10)
					.attr("cx", 250)
					.attr("cy", 30)
					.style("fill", d3.rgb(255,255,255))		    			
			    	.style("stroke-width", 5)
			    	.attr("stroke", 'steelblue');

		legende.append('text')
					.attr('dx', 270)
					.attr('dy', 33)
					.text('Team part of west conference')

		legende.append('circle')
					.attr("r", 10)
					.attr("cx", 250)
					.attr("cy", 60)
					.style("fill", d3.rgb(255,255,255))		    			
			    	.style("stroke-width", 5)
			    	.attr("stroke", 'red');

		legende.append('text')
					.attr('dx', 270)
					.attr('dy', 63)
					.text('Team part of east conference')
}

function updateTeamInfo(team){
		var teamInfo = d3.select("#teamInfo").select("text").remove();
		teamInfo = d3.select("#teamInfo")
							.attr("width", '500px')
							.attr('class', 'd3-tip')

		teamInfo.append('text')
					.attr("dx", '20px').attr("dy", '20px')
  					.html("<p><span style='color:orange'>" + team["team"] + "</span> <\p>" +
    						"SRS: <span style='color:red'>" + team["srs"] + "</span> </br>" + 
    						"League standings: <span style='color:red'>" + team["leaguerank"] + "</span> </br>" + 
    						"Play off result: <span style='color:red'>" + team["playoffrank"] + "</span>")
}
   		

function drawCircles(dataInput, radiusVariable, strokeVariable, outlineVariable, id, svg, xPos, yPos, width, height, colors){

		height = height - 100;

		var playOffs = dataInput[0].playoffs;
		var dataInput = dataInput[0].teams;
		var east = dataInput.filter(function(data) { return data.region == "east"});
		var west = dataInput.filter(function(data) { return data.region == "west"});
		
		var yMaxData = d3.max(dataInput, function(data) {return parseInt(data[outlineVariable]);});
		
		var positionArray = [];

        var visibleClass = "nothing";
		
		for (var i = 0; i < yMaxData; i++){
			positionArray[i] = [0, dataInput.filter(function(data) {return data[outlineVariable] == i+1 }).length]
		}
		positionArray[yMaxData] = [0, dataInput.filter(function(data) {return data[outlineVariable] == null }).length]

		function rgbcolor(strokeVariable, region) {
			if (region == 'west')
			    return (d3.rgb(colorScale(strokeVariable),colorScale(strokeVariable), 255)); 
			if (region == 'east')
				return (d3.rgb(255,colorScale(strokeVariable),colorScale(strokeVariable))); 
			else
				return (d3.rgb(colorScale(strokeVariable),255,colorScale(strokeVariable))); 
			};
		
		function colorScale(index) {
				return (200/15*(index));					// veranderen obv D3.scale
			};
		
		function yPosition(outlineVariable) {
			if (outlineVariable === undefined){
				return (yPos + height-40)}
			else	
				return (yPos + 20+(parseInt(outlineVariable)*2-1)*(height/(yMaxData*2+2)))
		}
		
		function xPosition(outlineVariable, team) {
			var lastMatch = playOffs.filter(function(data) {return data.loser == team});
			try {
				var winner = dataInput.filter(function(data) { return data.team == lastMatch[0].winner});
				var lastMatchWinner = playOffs.filter(function(data) {return data.loser == winner[0].team});
				var winnerofwinner = dataInput.filter(function(data) { return data.team == lastMatchWinner[0].winner})
				var loser = dataInput.filter(function(data) { return data.team == lastMatch[0].loser});}
				catch(err){
					var winnerofwinner = null;
					//var loser = dataInput.filter(function(data) { return data.team == lastMatch[0].loser});
				}
			if (outlineVariable != null) {
				if (winner != null){
					if ((winner[0].playoffrank == 1 || winner[0].playoffrank == 2) && winner[0].region == "west")
						return xPos + width/(positionArray[outlineVariable-1][1]+1)*1;
					else if ((winner[0].playoffrank == 1 || winner[0].playoffrank == 2) && winner[0].region == "east")
						return xPos + width/(positionArray[outlineVariable-1][1]+1)*positionArray[outlineVariable-1][1];
					else if ((winner[0].playoffrank == 3 && loser[0].playoffrank == 4 ) && winner[0].region == "west")
						return xPos + width/(positionArray[outlineVariable-1][1]+1)*2;										// Hard coded
					else if ((winner[0].playoffrank == 3 && loser[0].playoffrank == 4 ) && winner[0].region == "east")
						return xPos + width/(positionArray[outlineVariable-1][1]+1)*3;										// Hard coded
					else if ((winner[0].playoffrank == 3 && loser[0].playoffrank == 5 ) && winner[0].region == "west")
						return xPos + width/(positionArray[outlineVariable-1][1]+1)*3;										// Hard coded
					else if ((winner[0].playoffrank == 3 && loser[0].playoffrank == 5 ) && winner[0].region == "east")
						return xPos + width/(positionArray[outlineVariable-1][1]+1)*6;										// Hard coded
					else if ((winner[0].playoffrank == 4 && loser[0].playoffrank == 5 && winnerofwinner[0].playoffrank == 3 ) && winner[0].region == "west")
						return xPos + width/(positionArray[outlineVariable-1][1]+1)*4;										// Hard coded
					else if ((winner[0].playoffrank == 4 && loser[0].playoffrank == 5) && winner[0].region == "west")
						return xPos + width/(positionArray[outlineVariable-1][1]+1)*2;										// Hard coded
					else if ((winner[0].playoffrank == 4 && loser[0].playoffrank == 5 && winnerofwinner[0].playoffrank == 3 ) && winner[0].region == "east")
						return xPos + width/(positionArray[outlineVariable-1][1]+1)*5;										// Hard coded
					else if ((winner[0].playoffrank == 4 && loser[0].playoffrank == 5 ) && winner[0].region == "east")
						return xPos + width/(positionArray[outlineVariable-1][1]+1)*7;										// Hard coded
					}
				else {											// Nodig voor Champion
					positionArray[outlineVariable-1][0]++;
					return xPos + width/(positionArray[outlineVariable-1][1]+1)*positionArray[outlineVariable-1][0];
				}
				}
			else {
				positionArray[positionArray.length-1][0]++; // Ga naar laaste positie van de array
				return xPos + width/(positionArray[positionArray.length-1][1]+1)*positionArray[positionArray.length-1][0];
			}

		}

		// Returns an event handler for fading a given chord group.
		function fade(opacity) {
		  return function(g, i) {
		  	//console.log(svg.selectAll(".circles"));
		    svg.selectAll(".circles")
		        //.filter(function(d) { return d.source.index != i && d.target.index != i; })
		      .transition()
		        .style("opacity", opacity);
		  };
		}
		
		var radius = d3.scale.sqrt()
				.domain([d3.min(dataInput, function(data) {return parseInt(data[radiusVariable]);}),
					d3.max(dataInput, function(data) {return parseInt(data[radiusVariable]);})	])
				.range([width/60,width/20])

		
		function strokeColor(strokeVariable, groupVariable){
			if (strokeVariable == 1)
				return "gold"; 
			else if (strokeVariable == 2)
				return "silver";
			else if (strokeVariable == 3)
				return "#D3782F";
			else if (groupVariable == "west")
				return "steelblue"
			else if (groupVariable == "east")
				return "red"
			else
				return "black";
		}

		//var teamName = (teamWanted.replace(/\s+/g, '')).toLowerCase();
		var node = svg.selectAll('node')
				.data(dataInput);
		var defs = node.enter().append('defs');
		defs.append('pattern')
				.attr('id', function(data) { return (data[id].split(" ").join("_")+"logo");}) // just create a unique id (id comes from the json)
				.attr('patternContentUnits', 'objectBoundingBox')
				.attr('width', 1)
				.attr('height', 1)
				.append("svg:image")
				.attr("xlink:xlink:href", function(data) { 
					return ("./teamlogos/" + ((data[id].replace(/\s+/g, '')).toLowerCase()) + ".png");})
				.attr("height", 0.8)
				.attr("width", 0.8)
				.attr("x", 0.1)
				.attr("y", 0.1)
				.attr("preserveAspectRatio", "xMidYMid meet");  		
		
        var chart = svg.append("g")			//Append one div to the selected div in which we will construct the visualisation. This is done to separate mutliple visualisations..
                        .attr("class","chart bubblechart")
                        .attr("height", height)
                        .attr("width", width)
       	
       	var arc = d3.svg.arc()
					.outerRadius(function(data)
						{return (11 + parseFloat(data["srs"]))*1.5})
				.startAngle(0)
				.endAngle(1.5*Math.PI);
		
		var circlesEast = chart.append("g")
								.attr("id","circlesEast")
								.attr("class", "svg");
		
		var circlesWest = chart.append("g")
								.attr("id","circlesWest")
								.attr("class", "svg");

		var lines = chart.append("g")
								.attr("id", "arcs")
								.attr("class", "svg");
		
		var circleEast = circlesEast.selectAll("g") 			//Select all div's within the created div (= empty)
							.attr("class","circles")
			    			.data(east)							//Bind the input data with it
			  				.enter()							//Returns placeholders for input data for which there are nog 'div' elements. In this case, there are none, so for each entry a placholder is created
			  				.append("g");						//For each placeholder we'll append a div with below specifications of the div.
		
		var circleWest = circlesWest.selectAll("g") 			//Select all div's within the created div (= empty)
							.attr("class","circles")
			    			.data(west)							//Bind the input data with it
			  				.enter()							//Returns placeholders for input data for which there are nog 'div' elements. In this case, there are none, so for each entry a placholder is created
			  				.append("g");						//For each placeholder we'll append a div with below specifications of the div.

		var arcs = lines.selectAll("g")
							.attr("class", "arcs")
							.data(playOffs)
							.enter()
							.append("g");

		

		circleWest.append("circle")
							.attr("class","circle teambubble")
							.attr("id", function(data){
                                    visibleBoolean = true;
									return data[id].split(" ").join("_") })
			    			.attr("r",function(data)
								{return radius(parseFloat(data["srs"])); })
			    			.attr("cy", function(data){					// Distribute position over height
								return yPosition(data[outlineVariable])
			    					})
			    			.attr("cx", function(data){					// Separate position per region. Create more dynamic!
								return xPosition(data[outlineVariable], data[id]);
			    					})
                            .style("fill", function(data) { 
                                if (colors) { 
                                    return ShirtColors[data[id].replace(/\s+/g, '')].shirt;
                                } else {
                                    return ("url(#" + data[id].split(" ").join("_") + "logo)");
                                }
                            })
			    			.style("stroke-width", 3)
			    			.attr("stroke", function(data) {
                                return ShirtColors[data[id].replace(/\s+/g, '')].edge;
                                if (colors) { 
                                    return ShirtColors[data[id].replace(/\s+/g, '')].edge;
                                } else {
                                    return strokeColor(data[strokeVariable], data.region);
                                }
			    					})
      						.on('click', function(data){
      								d3.selectAll(".arc").style("visibility", "hidden");
   									var name = data.team.split(" ").join(".");
   									d3.selectAll("."+name).style("visibility", "visible");
   									visibleClass = name;
   									visibleBoolean = !visibleBoolean;
   									d3.select(this).style('fill','orange');
      						})
   							.on('mouseover', function(data) {
   									d3.select(this).style('fill','orange');
   									updateTeamInfo(data)
   									if (visibleBoolean){
   										d3.selectAll(".arc").style("visibility", "hidden");
   										var name = data.team.split(" ").join(".");
   										d3.selectAll("."+name).style("visibility", "visible");	
   									}
								})
      						.on('mouseout', function(data) {
      								d3.select("#teamInfo").select("text").remove();
                                    d3.select(this)
                                        .style('fill',("url(#" + data[id].split(" ").join("_") + "logo)"));
      								if (visibleBoolean){
      									d3.selectAll(".arc").style("visibility", "visible");
      									d3.select("#"+visibleClass.split(".").join("_")).style('fill','orange');
									}

                            });

		circleEast.append("circle")
							.attr("class","circle teambubble")
							.attr("id", function(data){
                                    visibleBoolean = true;
									return data[id].split(" ").join("_") })
			    			.attr("r",function(data)
								{return radius(parseFloat(data["srs"])); })
			    			.attr("cy", function(data){					// Distribute position over height
								return yPosition(data[outlineVariable])
			    					})
			    			.attr("cx", function(data){					// Separate position per region. Create more dynamic!
								return xPosition(data[outlineVariable], data[id]);
			    					})
			    			//.style("fill", function(data) { 
			    			.style("fill", function(data) { return ("url(#" + data[id].split(" ").join("_") + "logo)");})			    			
			    			.style("stroke-width", 3)
			    			.attr("stroke", function(data) { 					// Color stroke based on strokeVariable.
			    				return strokeColor(data[strokeVariable], data.region)
			    					})
      						.on('click', function(data){
      								d3.selectAll(".arc").style("visibility", "hidden");
   									var name = data.team.split(" ").join(".");
   									d3.selectAll("."+name).style("visibility", "visible");
   									visibleClass = name;
   									visibleBoolean = !visibleBoolean;
   									d3.select(this).style('fill','orange');
      						})
   							.on('mouseover', function(data) {
   									d3.select(this).style('fill','orange');
   									updateTeamInfo(data)
   									if (visibleBoolean){
   										d3.selectAll(".arc").style("visibility", "hidden");
   										var name = data.team.split(" ").join(".");
   										d3.selectAll("."+name).style("visibility", "visible");

   									}
								})
      						.on('mouseout', function(data) {
      								d3.select(this)
										.style('fill',("url(#" + data[id].split(" ").join("_") + "logo)"));
      								if (visibleBoolean){
      									d3.selectAll(".arc").style("visibility", "visible");
      									//console.log("."+visibleClass+"circles");
      									
									}
									else d3.select("#"+visibleClass).style('fill','orange');
                            });
				
      	var finale = playOffs.filter(function(d) { return d.game == 'Finals'})[0]
      	var champion = dataInput.filter(function(d) { return d.team == finale.winner})[0]
      	console.log(champion)

      	var layoutDict = {};

      	if (champion.region = 'west')
       		layoutDict = {
		      Champion: {
		            first:      [ xPos + width/3,   yPos + 20+(2)*(height/(yMaxData*2+2))],
		            second:     [ xPos + width/5,   yPos + 20+(4)*(height/(yMaxData*2+2))],
		            third:      [ xPos + width/9,   yPos + 20+(6)*(height/(yMaxData*2+2))]
		      },
		      Second: {
		            first:      [ xPos + width*4/5,   yPos + 20+(4)*(height/(yMaxData*2+2))],
		            second:     [ xPos + width*8/9,   yPos + 20+(6)*(height/(yMaxData*2+2))]
		      },
		      ThirdEast: {
		            first:      [ xPos + width*3/9,   yPos + 20+(6)*(height/(yMaxData*2+2))]
		      },
		      ThirdWest: {
		            first:      [ xPos + width*6/9,   yPos + 20+(6)*(height/(yMaxData*2+2))]
		      }
		 };
		 else 
		 	layoutDict = {
		      Champion: {
		            first:      [ xPos + width*2/3,   yPos + 20+(2)*(height/(yMaxData*2+2))],
		            second:     [ xPos + width*4/5,   yPos + 20+(4)*(height/(yMaxData*2+2))],
		            third:      [ xPos + width*8/9,   yPos + 20+(6)*(height/(yMaxData*2+2))]
		      },
		      Second: {
		            first:      [ xPos + width/5,   yPos + 20+(4)*(height/(yMaxData*2+2))],
		            second:     [ xPos + width/9,   yPos + 20+(6)*(height/(yMaxData*2+2))]
		      },
		      ThirdEast: {
		            first:      [ xPos + width*3/9,   yPos + 20+(6)*(height/(yMaxData*2+2))]
		      },
		      ThirdWest: {
		            first:      [ xPos + width*6/9,   yPos + 20+(6)*(height/(yMaxData*2+2))]
		      }
		 };

		 console.log(champion)
		 console.log(layoutDict)

		 var winner = dataInput.filter(function(d) { return d.team == 'Golden State Warriors'});
		 var loser = dataInput.filter(function(d) { return d.team == 'Golden State Warriors'});

      arcs.append("path")
      				.attr("class", function(data){
      								//console.log(dataInput.filter(function(d) {return d[id] == data.winner })[0])
									return "arc" + " " + data["winner"] + " " +  data["loser"] + " " + data["game"]})
      				.attr("stroke", "green")
      				.attr("stroke-width", 5)
      				.attr("d", d3.svg.diagonal()
								.source( function(data) { i = i+1
									winner = dataInput.filter(function(d) { return d.team == data.winner})[0];
									loser = dataInput.filter(function(d) { return d.team == data.loser})[0];
									if (winner.playoffrank == 1 && loser.playoffrank == 3) 
                     					return {	"x": layoutDict.Champion.first[0],
                     								"y": layoutDict.Champion.first[1]	}
                     				else if (winner.playoffrank == 1 && loser.playoffrank == 4) 
                     					return {	"x": layoutDict.Champion.second[0],
                     								"y": layoutDict.Champion.second[1]	}
                     				else if (winner.playoffrank == 1 && loser.playoffrank == 5) 
                     					return {	"x": layoutDict.Champion.third[0],
                     								"y": layoutDict.Champion.third[1]	}
                     				else if (winner.playoffrank == 2 && loser.playoffrank == 4) 
                     					return {	"x": layoutDict.Second.first[0],
                     								"y": layoutDict.Second.first[1]	}
                     				else if (winner.playoffrank == 2 && loser.playoffrank == 5) 
                     					return {	"x": layoutDict.Second.second[0],
                     								"y": layoutDict.Second.second[1]	}

      									return   {	"x": document.getElementById(winner.team.split(" ").join("_")).cx.animVal.value, 
                     								"y": document.getElementById(winner.team.split(" ").join("_")).cy.animVal.value
                     													}; })
                     			.target( function(data) { 
                     				if(winner.playoffrank == 1 && loser.playoffrank == 2)
                     					return {	"x": layoutDict.Champion.first[0],
                     								"y": layoutDict.Champion.first[1]	}
                     				else if (winner.playoffrank == 1 && loser.playoffrank == 3) 
                     					return {	"x": layoutDict.Champion.second[0],
                     								"y": layoutDict.Champion.second[1]	}
                     				else if (winner.playoffrank == 1 && loser.playoffrank == 4) 
                     					return {	"x": layoutDict.Champion.third[0],
                     								"y": layoutDict.Champion.third[1]	}
                     				else if (winner.playoffrank == 2 && loser.playoffrank == 3) 
                     					return {	"x": layoutDict.Second.first[0],
                     								"y": layoutDict.Second.first[1]	}
                     				else if (winner.playoffrank == 2 && loser.playoffrank == 4) 
                     					return {	"x": layoutDict.Second.second[0],
                     								"y": layoutDict.Second.second[1]	}

      								else 
      									return  {	"x": document.getElementById(loser.team.split(" ").join("_")).cx.animVal.value, 
                     								"y": document.getElementById(loser.team.split(" ").join("_")).cy.animVal.value
                     													}; }))
      				.style("fill", "none")
      				.style("visibility", visibleBoolean ? "visible" : "hidden");

      i = 0

      arcs.append("path")
      				.attr("class", function(data){
									return "arc" + " " + data["winner"] + " " +  data["loser"] + " " + data["game"]})
      				.attr("stroke", "green")
      				.attr("stroke-width", 5)
      				.attr("d", d3.svg.diagonal()
								.source( function(data) { i = i+1
									winner = dataInput.filter(function(d) { return d.team == data.winner})[0];
									loser = dataInput.filter(function(d) { return d.team == data.loser})[0];

      									return   {	"x": document.getElementById(loser.team.split(" ").join("_")).cx.animVal.value, 
                     												"y": document.getElementById(loser.team.split(" ").join("_")).cy.animVal.value
                     													}; })
                     			.target( function(data) { 
                     				if(winner.playoffrank == 1 && loser.playoffrank == 2)
                     					return {	"x": layoutDict.Champion.first[0],
                     								"y": layoutDict.Champion.first[1]	}
                     				else if (winner.playoffrank == 1 && loser.playoffrank == 3) 
                     					return {	"x": layoutDict.Champion.second[0],
                     								"y": layoutDict.Champion.second[1]	}
                     				else if (winner.playoffrank == 1 && loser.playoffrank == 4) 
                     					return {	"x": layoutDict.Champion.third[0],
                     								"y": layoutDict.Champion.third[1]	}
                     				else if (winner.playoffrank == 1 && loser.playoffrank == 5) 
                     					return {	"x": layoutDict.Champion.third[0],
                     								"y": layoutDict.Champion.third[1]	}
                     				else if (winner.playoffrank == 2 && loser.playoffrank == 3) 
                     					return {	"x": layoutDict.Second.first[0],
                     								"y": layoutDict.Second.first[1]	}
                     				else if (winner.playoffrank == 2 && loser.playoffrank == 4) 
                     					return {	"x": layoutDict.Second.second[0],
                     								"y": layoutDict.Second.second[1]	}
                     				else if (winner.playoffrank == 2 && loser.playoffrank == 5) 
                     					return {	"x": layoutDict.Second.second[0],
                     								"y": layoutDict.Second.second[1]	}
            
      								else 
      									return  {	"x": document.getElementById(winner.team.split(" ").join("_")).cx.animVal.value, 
                     								"y": document.getElementById(winner.team.split(" ").join("_")).cy.animVal.value
                     													}; }))
      				.style("fill", "none")
      				.style("visibility", visibleBoolean ? "visible" : "hidden");

      

      d3.select("."+visibleClass).style("visibility", "visible");
      d3.select("."+visibleClass+"circles").style('fill','orange');

      d3.selection.prototype.moveToFront = function() {
 					return this.each(function(){
    					this.parentNode.appendChild(this);
  					});
		};

      d3.selectAll("#circlesEast").moveToFront();
      d3.selectAll("#circlesWest").moveToFront();
      

	}
