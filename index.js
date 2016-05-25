var aggregate_data;

d3.csv("userLineData(20Sub).csv", function(error, data) {
  aggregate_data = data;
  d3.csv("dataForLine.csv", parse_row, function(rows) {
    actual_data = rows;
    line_ev = new d3.line_ev(rows, aggregate_data);
    line_ev.render_chart(960, 500, d3.select("svg"));
    d3.select("#clear").on("click", line_ev.reset);
    d3.select("#next").on("click", next(line_ev, "#next"));
  });
});


function next(obj, btn_id) {
  var seq = [obj.draw_agg, obj.draw_actual];

  return function () {
    if (seq.length > 0) {
      seq.pop()();
      if (seq.length === 0) {
        d3.select(btn_id).attr("disabled", "disabled");
      }
    }
  };
}

function parse_row(d) {
	dataClean = getDataForTicks(d);
	dataClean.Year = parseInt(dataClean.Year);
	dataClean.Total = +dataClean.Total;
	return d;
}
