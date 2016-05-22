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
	
var svg = d3.select("body").select("svg")

d3.select("#aggregates").on("click", drawAggregates);
	
function drawAggregates() {
	d3.csv("userLineData(20Sub).csv", function(error, data) {
		if (error) throw error;
		
		var labelVar = 'Date';
		var subNames = d3.keys(data[0])
			.filter(function (key) { return key !== labelVar;});
						
		var seriesData = subNames.map(function (name) {
			return {
				values: data.map(function (d) {
				return {name: name, date: d[labelVar], value: +d[name]};
				})
			};
		});
		
		x.domain(d3.extent(data, function(d) { return d.Date; }));	
		y.domain([
			d3.min(seriesData, function (c) { 
				return d3.min(c.values, function (d) { return d.value; });
			}),
			d3.max(seriesData, function (c) { 
				return d3.max(c.values, function (d) { return d.value; });
			})
		]);
				
		var line = d3.svg.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.value); });

		var series = svg.selectAll(".series")
			.data(seriesData)
			.enter().append("g")
			.attr("class", "series");
		
		var path = series.append("path")
			.attr("class", "aggregateLine")
			.attr("d", function (d) { return line(d.values); })
			
		var totalLength = path.node().getTotalLength();
		
		path.attr("stroke-dasharray", totalLength + " " + totalLength)
			.attr("stroke-dashoffset", totalLength)
			.transition()
			.duration(4000)
			.ease("linear")
			.attr("stroke-dashoffset", 0);
	})
}