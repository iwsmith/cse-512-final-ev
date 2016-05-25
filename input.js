var data;
var clicked = false;
var xticks;
var chart;
var points;
var ptdata = [];

var LEFT_BUTTON = 0;
var MIDDLE_BUTTON = 1;
var RIGHT_BUTTON = 2;

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

d3.csv("dataForLine.csv", function(rows) {
  data = rows;
  chart = render_chart();
});

function init_user_data(ticks) {
  var user_guess = {};
  ticks.forEach(function (n) {
    user_guess[n] = null;
  });
  return user_guess;
}

function find_closest(haystack, needle) {
  var dist = haystack.map(function (n, idx) { return [Math.abs( needle - n ), n];});
  dist.sort(function (a, b) {
    if (a[0] < b[0]) {
      return -1;
    } else if (a[0] > b[0]) {
      return 1;
    } else {
      return 0;
    }
  });
  return dist[0][1];
}

d3.select("#clear").on("click", function() { clear(points); update([]); });

var line = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return d[0] - margin.left; })
    .y(function(d) { return d[1] - margin.top; });

/* Covert an object to a array of arrays: {k1:v1, k2:v2} -> [[k1 v1], [k2 v2]] */
function convert_obj_to_array(obj) {
  return d3.zip(d3.keys(obj).map(parseFloat),
                d3.values(obj)).filter(function (n) { return n[1] !== null;});
}

/* Record a new user tick */
function tick(pt, points) {
  pt[0] = find_closest(d3.keys(points), pt[0]);
  points[pt[0]] = pt[1];
  return update(convert_obj_to_array(points));
}

/* Set all values to null on an object */
function clear(obj) {
  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    obj[key] = null;
  }
}

document.onmousedown = function(e) {
  if (e.button == LEFT_BUTTON) {
    e.preventDefault();
    clicked = true;
  }
};

document.onmouseup = function(e) {
  if (e.button == LEFT_BUTTON) {
    clicked = false;
  }
};

function update(data) {
  var points = d3.select("svg").selectAll(".points").data(data, function(d) { return d[0]; });
  points.enter().append("circle").attr("r", 3).attr("class", "points");
  points.attr("cx", function (d) { return d[0]; })
                            .attr("cy", function (d) { return d[1]; });
  points.exit().remove();

  d3.select(".line").attr("d", line(data));
}

function render_chart() {

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

  var svg = d3.select("body").select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .on("mousemove", function() { if (clicked) { tick(d3.mouse(this), points);} })
      .on("click", function() { tick(d3.mouse(this), points); })
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

    svg.append("path").attr("class", "line");

  var l_xticks = Array.from(document.querySelectorAll(".x.axis > .tick > line"))
  .map(function (e) { return e.getBoundingClientRect().left;});

  points = init_user_data(l_xticks);
}
