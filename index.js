var actual_data;
d3.csv("dataForLine.csv", parse_row, function(rows) {
  actual_data = rows;
  line_ev = new d3.line_ev(rows);
  line_ev.render_chart(960, 500, d3.select("svg"));
  d3.select("#clear").on("click", line_ev.reset);
  d3.select("#next").on("click", line_ev.draw_actual);
});


function parse_row(d) {
	dataClean = getDataForTicks(d);
	dataClean.Year = parseInt(dataClean.Year);
	dataClean.Total = +dataClean.Total;
	return d;
}
