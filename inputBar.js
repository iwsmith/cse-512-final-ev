
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "");

var color = d3.scale.ordinal()
    .range(["#f1f1f1","black"]);

var svg = d3.select("body").select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("dataForBar.csv", type, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.country; }));
  y.domain([0, d3.max(data, function(d) { return d.emission; })]);


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll(".tick text")
      .call(wrap, x.rangeBand());

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("emission (in inches)");

    svg.append("g")         
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )

  svg.selectAll(".g")
    .data(data)
    .enter().append("g").each(function(d,i) {
    d3.select(this)
      .append("rect")
      .attr("class", "bar")
      // .attr("x", function(d) {if (i%2 == 0) {return x(d.country) + 10;} else {return x(d.country);}})
      .attr("x", function(d) { return x(d.country); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.emission); })
      .attr("height", function(d) { return height - y(d.emission); })
      .style("fill","black")
      .each(function(d) {
            if (d.country !="UNITED STATES OF AMERICA") {
              d3.select(this).attr("opacity", 0.0);
            }
        })

    d3.select(this)
      .append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", function(d) { return x(d.country) + 46; })
      .attr("cy",height)
      .attr("cursor","row-resize")
      .call(drag);
  //HERE - commented out this below part. We may need to invert the y scale in order to show the value they set the bar to at the top
   d3.select(this)
      .append("text")
      .attr("class","label")
    }); 
});

   var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("drag", dragging)
  
  function dragging(d) {
    $('#tutorial').hide();
    //bar
    d3.select(this.previousSibling)
      .attr("opacity", 1)
      .attr("y", d.y = d3.mouse(this)[1])
      .attr("height", function(d) { return height - d.y;});
    //text
    d3.select(this.nextSibling)
      .attr("x", function(d) { return x(d.country) + 32; })
      .attr("y", d.y = d3.mouse(this)[1] - 10)
      .attr("height", function(d) { return height - d.y;})
      .text(d3.round(y.invert(d.y) - 2.3,1));

    d3.select(this).attr("cy", d.y = d3.mouse(this)[1]);
  }

  function getdatavalue(y_value) {
    return d3.scale.linear.invert(y_value);
  }

  function type(d) {
    d.emission = +d.emission;
    return d;
  }

  function clickmove(d) {
  console.log(this);
        d3.select(this)
        .attr("y", d.y = d3.mouse(this)[1])
        //.attr("y", d.y = d3.event.y) //HERE - THIS LINE WAS NOT TRANSLATING TO PLOTTING SPACE - d3.mouse does
        .attr("opacity", 1.0) //HERE -- OPACITY NOW VISIBLE
        .attr("height", function(d) { return height - d.y;});
        //.attr("height", function(d) { return height - y(d.y);}); //HERE - THIS LINE WAS PASSING Y POSITION THROUGH SCALE WHICH IS MEANT ONLY TO TRANSFORM DATA VALUES (Y POS DOESNT NEED SCALING)
    }


  function dragmove(){
    console.log(d3.mouse(this));
    var dragTarget = d3.select(this);
    dragTarget
        .attr("cx", function(){return d3.event.dx + parseInt(dragTarget.attr("cx"))})
        .attr("cy", function(){return d3.event.dy + parseInt(dragTarget.attr("cy"))});
  };
  //wrap x-axis 
  function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function make_x_axis() {        
    return d3.svg.axis()
        .scale(x)
         .orient("bottom")
         .ticks(10)
}

function make_y_axis() {        
    return d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10)
}



  function updateData() {
    $('#legend').show();
    $('#tensec').show();
    $('#submitguess').hide();
    $('#basic_desc').hide();
    $('#submitbutton').show();
    $('#reason_para').show()


    var user_data = [];
    d3.selectAll(".bar").remove();
    d3.selectAll(".dot").remove();
    d3.selectAll('.label').each(function(d) {
      user_data.push(d3.select(this).text());
    });

    $('#guess1').val(user_data[0]);
    $('#guess2').val(user_data[1]);
    $('#guess3').val(user_data[2]);
    $('#guess4').val(user_data[3]);
    $('#guess5').val(user_data[4]);
    $('#guess6').val(user_data[5]);
    $('#guess7').val(user_data[6]);
    $('#guess8').val(user_data[7]);
    $('#guess9').val(user_data[8]);
    $('#guess10').val(user_data[9]);

    //data binding for two bars 
    d3.tsv("data.tsv", type, function(error, data) {
    var final_final_data = [];
     data.forEach(function(d,i) {
        var temp1 = {};
        var temp2 = {};
        var final_data = [];
        temp1["name"] = "user_data"
        temp1["value"] = user_data[i];
        temp2["name"] = "true_data"
        temp2["value"] = d.emission;
        final_data.push(temp1);
        final_data.push(temp2);
        // console.log(d.emission);
        // console.log(user_data[i]);
        final_final_data.push(final_data);
      });
        // console.log(final_final_data);
  x1.domain(["user_data","true_data"]).rangeRoundBands([0, x.rangeBand() - 10]);

   var state = svg.selectAll(".state")
        .data(data)
      .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x(d.country) + ",0)"; });
    state.selectAll("rect")
        .data(function(d,i) {return final_final_data[i]; })
      .enter().append("rect")
        .attr("width", x.rangeBand() / 2.2)
        .attr("x", function(d,i) { return x1(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.name); });


  state.selectAll("text")
    .data(function(d,i) {return final_final_data[i]; })
    .enter().append("text")
    .attr("x", function(d) { return x1(d.name) + 8; })
    .attr("y", function(d,i){ return y(d.value) - 6 ; })
    // .attr("height", function(d) { return height - d.y;})
    .text(function(d,i){ return d.value; });

    d3.selectAll(".label").remove();
    

legend
    var legend = svg.selectAll(".legend")
      .data(["True data","Your prediction"].slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });


  }); // data end
} //update data function end 