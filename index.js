
d3.csv("dataForLine.csv", function(rows) {
  line_ev = new d3.line_ev(rows);
  line_ev.render_chart(960, 500, d3.select("svg"));
  d3.select("#clear").on("click", line_ev.reset);
});
