function drawCircles(dataInput, radiusVariable, strokeVariable, outlineVariable, id, svg, xpos, ypos, width, height){
		var playOffs = dataInput[0].playoffs;
		var dataInput = dataInput[0].teams;
		var east = dataInput.filter(function(data) { return data.region == "east"});
		var west = dataInput.filter(function(data) { return data.region == "west"});
		
		var yMaxData = d3.max(dataInput, function(data) {return parseInt(data[outlineVariable]);});
		
		var positionArray = [];
		
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
				return (ypos + height-40)}
			else	
				return (ypos + 20+(parseInt(outlineVariable))*(height/(yMaxData+2)))
		}
		
		function xPosition(outlineVariable) {
			if (outlineVariable != null) {
				positionArray[outlineVariable-1][0]++;
				return xpos + width/(positionArray[outlineVariable-1][1]+1)*positionArray[outlineVariable-1][0];
			}
			else {
				positionArray[positionArray.length-1][0]++;
				return xpos + width/(positionArray[positionArray.length-1][1]+1)*positionArray[positionArray.length-1][0];
			}
		}
		
		function radius(radiusVariable) {
            return (11 + radiusVariable)*1.8 * (width / 1000) ;				// veranderen obv D3.scale
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
   		
   		var tip = d3.tip()
  					.attr('class', 'd3-tip')
  					.offset([-10, 0])
  					.html(function(d) {
    					return  "<p><span style='color:orange'>" + d["team"] + "</span> <\p>" +
    						"SRS: <span style='color:red'>" + d["srs"] + "</span> </br>" + 
    						"League standings: <span style='color:red'>" + d["leaguerank"] + "</span> </br>" + 
    						"Play off result: <span style='color:red'>" + d["playoffrank"] + "</span>";
  						})
  		d3.select(".d3-tip").remove();
		
        var chart = svg.append("g")
                        .attr("class","chart bubblechart")
                        .attr("height", height)
                        .attr("width", width)
		
		chart.call(tip);
		
		// Create fill texture
		chart.append('defs')
		  .append('pattern')
		    .attr('id', 'diagonalHatch')
		    .attr('patternUnits', 'userSpaceOnUse')
		    .attr('width', 4)
		    .attr('height', 4)
		  .append('path')
		    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
		    .attr('stroke', '#000000')
		    .attr('stroke-width', 1);
       	
       	var arc = d3.svg.arc()
					.outerRadius(function(data)
						{return (11 + parseFloat(data["srs"]))*1.5})
				.startAngle(0)
				.endAngle(1.5*Math.PI);
      	
      	var pie = d3.layout.pie()
      						.value(function(data) { 
      							return data["W/L%"]; })
      						.sort(null);
		
		var circlesEast = chart.append("g")
								.attr("id","circlesEast");
		
		var circlesWest = chart.append("g")
								.attr("id","circlesWest");

		var lines = chart.append("g")
								.attr("id", "arcs");
		
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
									return data[id] })
			    			.attr("r",function(data)
								{return radius(parseFloat(data["srs"])); })
			    			.attr("cy", function(data){					// Distribute position over height
								return yPosition(data[outlineVariable])
			    					})
			    			.attr("cx", function(data){					// Separate position per region. Create more dynamic!
								return xPosition(data[outlineVariable]);
			    					})
			    			.style("fill", function(data) { 
			    					return rgbcolor(data[strokeVariable], data["region"]);
			    					})	//Separate fill color per region. Create more dynamic!			    			
			    			.style("stroke-width", 5)
			    			.attr("stroke", function(data) { 					// Color stroke based on strokeVariable.
			    				return strokeColor(data[strokeVariable], data.region)
			    					})
   							.on('mouseover', function(data) {
   									d3.select(this).style('fill','orange');
   									tip.show(data);
								})
      						.on('mouseout', function(data) {
      								d3.select(this)
										.style('fill',rgbcolor(data[strokeVariable], data["region"]));
      								tip.hide(data);
      							});

		circleEast.append("circle")
							.attr("class","circle teambubble")
							.attr("id", function(data){
									return data[id] })
			    			.attr("r",function(data)
								{return radius(parseFloat(data["srs"])); })
			    			.attr("cy", function(data){					// Distribute position over height
								return yPosition(data[outlineVariable])
			    					})
			    			.attr("cx", function(data){					// Separate position per region. Create more dynamic!
								return xPosition(data[outlineVariable]);
			    					})
			    			.style("fill", function(data) { 
			    					return rgbcolor(data[strokeVariable], data["region"]);
			    					})	//Separate fill color per region. Create more dynamic!			    			
			    			.style("stroke-width", 5)
			    			.attr("stroke", function(data) { 					// Color stroke based on strokeVariable.
			    				return strokeColor(data[strokeVariable], data.region)
			    					})
   							.on('mouseover', function(data) {
   									d3.select(this).style('fill','orange');
   									tip.show(data);
								})
      						.on('mouseout', function(data) {
      								d3.select(this)
										.style('fill',rgbcolor(data[strokeVariable], data["region"]));
      								tip.hide(data);
      							});

      arcs.append("line")
      				.attr("class", "arc")
      				.attr("id", function(data){
									return data["game"] })
      				.attr("stroke-width", 2)
      				.attr("stroke", "green")
      				.attr("x1", function(data){
      					console.log(data);
      					console.log(data.winner);
      					console.log(document.getElementById(data.winner));
      					return document.getElementById(data.winner).cx.animVal.value;
      				})
      				.attr("x2", function(data){
      					console.log(data.loser);
      					console.log(document.getElementById(data.loser));
      					return document.getElementById(data.loser).cx.animVal.value;
      				})
      				.attr("y1", function(data){
      					return document.getElementById(data.winner).cy.animVal.value;
      				})
      				.attr("y2", function(data){
      					return document.getElementById(data.loser).cy.animVal.value;
      				});
	}	
	
