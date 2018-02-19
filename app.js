var minYear = d3.min(birthData, d => d.year);
var maxYear = d3.max(birthData, d => d.year);
var width = 600;
var height = 600;

var continents = [];
for (var i = 0; i < birthData.length; i++) {
  var continent = birthData[i].continent;
  if (continents.indexOf(continent) === -1) {
    continents.push(continent);
  }
}

// prettier-ignore
var colorScale = d3.scaleOrdinal()
                   .domain(continents)
                   .range(d3.schemeCategory10);

// prettier-ignore
d3.select("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .classed("chart", true);

// prettier-ignore
d3.select("input")
    .property("min", minYear)
    .property("max", maxYear)
    .property("value", minYear)
    .on("input", function() {
        makeGraph(+d3.event.target.value);
    });

makeGraph(minYear);

function makeGraph(year) {
  var yearData = birthData.filter(d => d.year === year);

  // prettier-ignore
  var arcs = d3.pie()
             .value(d => d.births)
             .sort(function(a, b) {
                if(a.continent < b.continent) return -1;
                else if(a.continent > b.continent) return 1;
                else return a.births - b.births;
             })
             (yearData);

  // prettier-ignore
  var path = d3.arc()
             .outerRadius(width / 2 -10)
             .innerRadius(width / 4);

  // prettier-ignore
  var update = d3.select(".chart")
                 .selectAll(".arc")
                 .data(arcs);

  // prettier-ignore
  update
    .exit()
    .remove();

  // prettier-ignore
  update
    .enter()
    .append("path")
      .classed("arc", true)
    .merge(update)
      .attr("fill", d => colorScale(d.data.continent))
      .attr("stroke", "black")
      .attr("d", path);
}
