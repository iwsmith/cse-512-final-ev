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

var comparisonLine = d3.svg.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.Total); });
	
d3.select("#next").on("click", drawComparisonLine);

	
function drawComparisonLine(){
	d3.csv("dataForLine.csv", type, function(error, data) {
		if (error) throw error;
		x.domain(d3.extent(data, function(d) { return d.Year; }));
		y.domain(d3.extent(data, function(d) { return d.Total; }));
			
		var path = svg.append("path")
			.datum(data)
			.attr("class", "comparisonLine")
			.attr("d", comparisonLine);
				
		var totalLength = path.node().getTotalLength()
		
		path.attr("stroke-dasharray", totalLength + ' ' + totalLength)
			.attr("stroke-dashoffset", totalLength)
			.transition()
				.duration(4000)
				.ease("linear")
				.attr('stroke-dashoffset', 0)
	})
};

function type(d) {
	dataClean = getDataForTicks(d)
	dataClean.Year = parseInt(dataClean.Year)
	dataClean.Total = +dataClean.Total;
	return d;
}

function getDataForTicks(d) {
	var cleaned = d
	return cleaned
}
