function drawCircles(dataInput, radiusVariable, strokeVariable, outlineVariable, id, svg, xPos, yPos, width, height){
		//console.log(dataInput);
		
		var playOffs = dataInput[0].playoffs;
		var dataInput = dataInput[0].teams;
		var east = dataInput.filter(function(data) { return data.region == "east"});
		var west = dataInput.filter(function(data) { return data.region == "west"});

		//var height = 600,
			//width = document.body.clientWidth*0.8;
		
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
		
		function radius(radiusVariable) {
			return (11 + radiusVariable)*1.8 * width/1000;				// veranderen obv D3.scale
		}
		
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
   		
   		var tip = d3.tip()
  					.attr('class', 'd3-tip')
  					.offset([-10, 0])
  					.html(function(d) {
    					return  "<p><span style='color:orange'>" + d["team"] + "</span> <\p>" +
    						"SRS: <span style='color:red'>" + d["srs"] + "</span> </br>" + 
    						"League standings: <span style='color:red'>" + d["leaguerank"] + "</span> </br>" + 
    						"Play off result: <span style='color:red'>" + d["playoffrank"] + "</span>";
  						})
  		
		
        var chart = svg.append("g")			//Append one div to the selected div in which we will construct the visualisation. This is done to separate mutliple visualisations..
                        .attr("class","chart bubblechart")
                        .attr("height", height)
                        .attr("width", width)
		
		chart.call(tip);
       	
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
			    			//.style("fill", function(data) { 
			    			//		return rgbcolor(data[strokeVariable], data["region"]);
			    			//		})	//Separate fill color per region. Create more dynamic!	
			    			.style("fill", function(data) { console.log("url(#" + data[id].split(" ").join("_") + "logo)")
			    				return ("url(#" + data[id] + "logo)");})		    			
			    			.style("stroke-width", 5)
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
   									tip.show(data);
   									if (visibleBoolean){
   										d3.selectAll(".arc").style("visibility", "hidden");
   										var name = data.team.split(" ").join(".");
   										d3.selectAll("."+name).style("visibility", "visible");	
   									}
								})
      						.on('mouseout', function(data) {
      								tip.hide(data);
                                    d3.select(this)
                                        .style('fill',rgbcolor(data[strokeVariable], data["region"]));
      								if (visibleBoolean){
      									d3.selectAll(".arc").style("visibility", "visible");
      									//console.log("#"+visibleClass.split(".").join("_"))
      									//console.log(d3.select("#"+visibleClass.split(".").join("_")));
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
			    			//		return rgbcolor(data[strokeVariable], data["region"]);
			    			//		})	//Separate fill color per region. Create more dynamic!
			    			.style("fill", function(data) { return ("url(#" + data[id].split(" ").join("_") + "logo)");})			    			
			    			.style("stroke-width", 5)
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
   									tip.show(data);
   									if (visibleBoolean){
   										d3.selectAll(".arc").style("visibility", "hidden");
   										var name = data.team.split(" ").join(".");
   										d3.selectAll("."+name).style("visibility", "visible");

   									}
								})
      						.on('mouseout', function(data) {
      								tip.hide(data);
      								d3.select(this)
										.style('fill',rgbcolor(data[strokeVariable], data["region"]));
      								if (visibleBoolean){
      									d3.selectAll(".arc").style("visibility", "visible");
      									//console.log("."+visibleClass+"circles");
      									
									}
									else d3.select("#"+visibleClass).style('fill','orange');
                            });

      var links = [];

      playOffs.forEach(function(data) {
      	var d = {}
      	var c = {}
       	if (data.game = "Finals") {	
       		d.x = document.getElementById(data.winner.split(" ").join("_")).cx.animVal.value;
       		d.y = document.getElementById(data.winner.split(" ").join("_")).cy.animVal.value;
       		var winner = data.winner;
       		winner = dataInput.filter(function(data) { return data.team == winner});
       		c.x = 0;
       		c.y = 0;
       		links.push({source: d, target: c});
      	}
      	else {
      		d.x = 0;
       		d.y = 0;
       		c.x = 0;
       		d.y = 0;
       		links.push({source: d, target: c});	
      	}

       });

      //console.log(visibleClass);

      var diagonal = d3.svg.diagonal()
								.source( function(data) { return {	"x":document.getElementById(data.winner.split(" ").join("_")).cx.animVal.value, 
                     												"y":document.getElementById(data.winner.split(" ").join("_")).cy.animVal.value}; })
                     			.target( function(data) { return {	"x":document.getElementById(data.loser.split(" ").join("_")).cx.animVal.value,
                     												"y":document.getElementById(data.loser.split(" ").join("_")).cy.animVal.value}; })
                     			//.projection(function(data) { return [data.x, data.y]; });

      arcs.append("path")
      				.attr("class", function(data){
									return "arc" + " " + data["winner"] + " " +  data["loser"] + " " + data["game"]})
      				.attr("stroke", "green")
      				.attr("d", diagonal)
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
