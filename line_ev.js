d3.line_ev = function (true_values, aggregate_values) {
  MARGIN_DEFAULT = {top: 20, right: 20, bottom: 30, left: 50};
  var line_ev = {};
  var x;
  var y;
  var xAxis = null;
  var yAxis = null;
  var margin = MARGIN_DEFAULT;
  var svg = null;
  var xTicks = null;
  var user_guess = null;
  var clicked = false;
  var LEFT_BUTTON = 0;
  var MIDDLE_BUTTON = 1;
  var RIGHT_BUTTON = 2;

  //TODO: Create screen<->chart conversion functions
  var guess_line = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return d[0] - margin.left; })
    .y(function(d) { return d[1] - margin.top; });

  var actual_line = d3.svg.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.Total); });

	var aggregate_line = d3.svg.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.value); });

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

  line_ev.render_chart = function (total_width, total_height, elem) {
    chart_width = total_width - margin.left - margin.right;
    chart_height = total_height - margin.top - margin.bottom;

    x = d3.scale.linear()
        .range([0, chart_width]);

    y = d3.scale.linear()
        .range([chart_height, 0]);

    xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    svg = elem;
    svg = svg.attr("width", total_width)
       .attr("height", total_height)
       .on("mousemove", function() { if (clicked) { tick(d3.mouse(this));} })
       .on("click", function() { tick(d3.mouse(this)); })
       .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(true_values, function(d) { return d.Year; }));
    y.domain(d3.extent(true_values, function(d) { return d.Total; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chart_height + ")")
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

    // TODO: Change this to a unique id so multiple charts can exist on a single page
    xTicks = Array.from(document.querySelectorAll(".x.axis > .tick > line"))
    .map(function (e) { return e.getBoundingClientRect().left;});

    user_guess = init_user_data(xTicks);
  };

  line_ev.reset = function() {
    clear(user_guess);
    return line_ev.update(convert_obj_to_array(user_guess));
  };

  line_ev.update = function (data) {
    var points = svg.selectAll(".points").data(data, function(d) { return d[0]; });
    points.enter().append("circle").attr("r", 3).attr("class", "points");
    points.attr("cx", function (d) { return d[0] - margin.left; })
          .attr("cy", function (d) { return d[1] - margin.top; });
    points.exit().remove();

    d3.select(".line").attr("d", guess_line(data));
  };

  line_ev.draw_actual = function() {
    var path = svg.append("path")
    .datum(true_values)
		.attr("class", "comparisonLine")
		.attr("d", actual_line(true_values));

		var totalLength = path.node().getTotalLength();

		path.attr("stroke-dasharray", totalLength + ' ' + totalLength)
			.attr("stroke-dashoffset", totalLength)
			.transition()
				.duration(4000)
				.ease("linear")
				.attr('stroke-dashoffset', 0);
  };

  line_ev.draw_agg = function() {
		var labelVar = 'Date';
		var subNames = d3.keys(aggregate_values[0])
			.filter(function (key) { return key !== labelVar;});

		var seriesData = subNames.map(function (name) {
			return {
				values: aggregate_values.map(function (d) {
  				return {name: name, date: d[labelVar], value: +d[name]};
				})
			};
		});

		var series = svg.selectAll(".series")
			.data(seriesData)
			.enter().append("g")
			.attr("class", "series");

		var path = series.append("path")
			.attr("class", "aggregateLine")
			.attr("d", function (d) { return aggregate_line(d.values); });

		var totalLength = path.node().getTotalLength();

		path.attr("stroke-dasharray", totalLength + " " + totalLength)
			.attr("stroke-dashoffset", totalLength)
			.transition()
			.duration(4000)
			.ease("linear")
			.attr("stroke-dashoffset", 0);
  };

  function tick(pt) {
    pt[0] = find_closest(d3.keys(user_guess), pt[0]);
    user_guess[pt[0]] = pt[1];
    if (d3.values(user_guess).every(function (v) { return v !== null; })) {
      d3.select("#next").attr("disabled", null);
    }
    return line_ev.update(convert_obj_to_array(user_guess));
  }

  /* Set all values to null on an object */
  function clear(obj) {
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      obj[key] = null;
    }
  }

  /* Given an array of points (haystack) [[x1 y1], [x2 y2] ...] and a target
     point (needle) [x y], return the nearest x value */
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

  function init_user_data(ticks) {
    var user_guess = {};
    ticks.forEach(function (n) {
      user_guess[n] = null;
    });
    return user_guess;
  }

  /* Covert an object to a array of arrays: {k1:v1, k2:v2} -> [[k1 v1], [k2 v2]] */
  function convert_obj_to_array(obj) {
    return d3.zip(d3.keys(obj).map(parseFloat),
                  d3.values(obj)).filter(function (n) { return n[1] !== null;});
  }

  return line_ev;
};
