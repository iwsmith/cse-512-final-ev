var data;
var clicked = false;
var ptdata = [];

d3.csv("data.csv", function(rows) {
  data = rows;
  render_chart();
});

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d, i) { return d[0]; })
    .y(function(d, i) { return d[1]; });

function tick(pt) {
  ptdata.push(pt);
  d3.select("#user-guess").attr("d", function(d) { return line(d);});
}

document.onmousedown = function(e) { e.preventDefault(); clicked = true; };
document.onmouseup = function() { clicked = false; };

function render_chart() {
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.Total); });

  var svg = d3.select("body").select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .on("mousemove", function() { if (clicked) { var pt = d3.mouse(this); tick(pt);} })
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(data, function(d) { return d.Year; }));
  y.domain(d3.extent(data, function(d) { return d.Total; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis.tickFormat(d3.format()));

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Million Metric Tons of C");

  svg.append("g")
    .append("path")
    .data([ptdata])
    .attr("class", "line")
    .attr("id", "user-guess")
    .attr("d", line);
}
