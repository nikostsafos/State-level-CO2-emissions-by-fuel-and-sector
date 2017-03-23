(function() {

var contentWidth = document.getElementById('content').clientWidth;

var plotRow;
  if (contentWidth >= 500) {plotRow = 2.05;} 
  else { plotRow = 1; }

var xWidth = contentWidth / plotRow;
var yHeight = contentWidth / plotRow;

var elem = document.getElementById('stateSelect'); // Create variable element that stores value from menu 
if(elem){ elem.addEventListener("load", graphFuel('#graphic', elem.value, xWidth, yHeight), false)}; // on load, graph default value 
if(elem){ elem.addEventListener("load", graphSector('#graphic', elem.value, xWidth, yHeight), false)}; // on load, graph default value 
if(elem){ elem.addEventListener("change", onSelectChange, false)}; // on change, run 'onSelectChange function' that graphs new country 

function onSelectChange(){
  var value = this.value;
  graphFuel('#graphic', value, xWidth, yHeight);
  graphSector('#graphic', value, xWidth, yHeight);
}

function updateGraph() {
  
  var contentWidth = document.getElementById('content').clientWidth;
  var plotRow;
  if (contentWidth >= 500) {plotRow = 2.05;} 
  else { plotRow = 1; }

  var xWidth = contentWidth / plotRow;
  var yHeight = contentWidth / plotRow;

  var elem = document.getElementById('stateSelect'); // Create variable element that stores value from menu 
  if(elem){ elem.addEventListener("load", graphFuel('#graphic', elem.value, xWidth, yHeight), false)}; // on load, graph default value 
  if(elem){ elem.addEventListener("load", graphSector('#graphic', elem.value, xWidth, yHeight), false)}; // on load, graph default value 
}

window.onresize = updateGraph;


function graphFuel(id, state, w, h) {

  // Set margin parameters 
  var margin = {top: 40, right: 20, bottom: 20, left: 50},
                width = w - margin.left - margin.right,
                height = h - margin.top - margin.bottom;

  // x function map the circles along the x axis
  var x = d3.scaleLinear().range([0, width]);

  // y function map the variables along the y axis
  var y = d3.scaleLinear().range([height, 0]);

  // Read in data 
  d3.csv('cleanData/co2emissions.csv', function(error, data) {  
    data.forEach(function(d) {
      d.Year = +d.Year;
      d.State = d.State;
      d.Coal = +d.Coal;
      d.Oil = +d.Oil;
      d.Gas = +d.Gas;
      d.Residential = +d.Residential;
      d.Commercial = +d.Commercial;
      d.Industry = +d.Industry;
      d.Transport = +d.Transport;
      d.Electricity = +d.Electricity;
    });

  // Subset the data based on variables selected 
    data = data.filter(function (d) { return d.State == state } );

    // Create function for rendering lines 
    var lineCoal = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.Coal); });

    var lineGas = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.Gas); });

    var lineOil = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.Oil); });

    // Create SVG item 
    d3.select(id).selectAll('*').remove();
    var svgLineChart = d3.select(id)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Scale the functions defined above with range from variables 
    x.domain(d3.extent([1980, 2015]));
    //y.domain(d3.extent([0,100]));
    y.domain(d3.extent(
      [].concat(
          data.map (function (item) {
        return (item.Oil);
      }), data.map ( function (item) {
        return (item.Coal);
      }), data.map ( function (item) {
        return (item.Gas);
      }))));
      

    // Append x axis 
    svgLineChart.append("g")
        .attr('class', 'xaxis')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
        .tickFormat(d3.format(".0f"))
        .tickValues([1980, 1990, 2000, 2010]));

    // Append y axis
    svgLineChart.append("g")
        .attr('class', 'yaxis')
        .call(d3.axisLeft(y)
        .ticks(5));

    // Append text for y axis label
    svgLineChart.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -45)
        .attr('x', -height/2)
        .attr('dy', '.71em')
        .style('text-anchor', 'middle')
        .text('million metric tons of CO2');
    
    // Draw line 
    svgLineChart.append("path")
        // .datum(data.filter(function(d) { return d; }))
        .datum(data)
        .attr("fill", "None")
        .attr("stroke", '#636363')
        .attr("stroke-width", 2)
        .attr("d", lineCoal)

     // Draw line 
     svgLineChart.append("path")
        .datum(data)
        .attr("fill", "None")
        .attr("stroke", '#d73027')
        .attr("stroke-width", 2)
        .attr("d", lineGas);

    svgLineChart.append("path")
        .datum(data)
        .attr("fill", "None")
        .attr("stroke", '#2ca25f')
        .attr("stroke-width", 2)
        .attr("d", lineOil);

    // // text label for the x axis
    svgLineChart.append("text")
        .attr('x', width/2)
        .attr("y", height - (height * 1.03))
        .style('text-anchor', 'middle')
        .text(state + ' (by fuel)');
  });
return this;
};

function graphSector(id, state, w, h) {

  // Set margin parameters 
  var margin = {top: 40, right: 20, bottom: 20, left: 50},
                width = w - margin.left - margin.right,
                height = h - margin.top - margin.bottom;

  // x function map the circles along the x axis
  var x = d3.scaleLinear().range([0, width]);

  // y function map the variables along the y axis
  var y = d3.scaleLinear().range([height, 0]);
  
  // Read in data 
  d3.csv('cleanData/co2emissions.csv', function(error, data) {  
    data.forEach(function(d) {
      d.Year = +d.Year;
      d.State = d.State;
      d.Coal = +d.Coal;
      d.Oil = +d.Oil;
      d.Gas = +d.Gas;
      d.Residential = +d.Residential;
      d.Commercial = +d.Commercial;
      d.Industry = +d.Industry;
      d.Transport = +d.Transport;
      d.Electricity = +d.Electricity;
    });

  // Subset the data based on variables selected 
    data = data.filter(function (d) { return d.State == state } );

    // Create function for rendering lines 
    var lineResidential = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.Residential); });

    var lineCommercial = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.Commercial); });

    var lineIndustry = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.Industry); });

    var lineTransport = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.Transport); });

    var lineElectricity = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.Electricity); });

    // Create SVG item 
    var svgLineChart = d3.select(id)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Scale the functions defined above with range from variables 
    x.domain(d3.extent([1980, 2015]));
    y.domain(d3.extent(
      [].concat(
          data.map (function (item) {
        return (item.Residential);
      }), data.map ( function (item) {
        return (item.Commercial);
      }), data.map ( function (item) {
        return (item.Industry);
      }), data.map ( function (item) {
        return (item.Transport);
      }), data.map ( function (item) {
        return (item.Electricity);
      }))));

    // Append x axis 
    svgLineChart.append("g")
        .attr('class', 'xaxis')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
        .tickFormat(d3.format(".0f"))
        // .tickValues([1965, 1975, 1985, 1995, 2005, 2015]));
        .tickValues([1980, 1990, 2000, 2010]));

    // Append y axis
    svgLineChart.append("g")
        .attr('class', 'yaxis')
        .call(d3.axisLeft(y)
        .ticks(5));

    // Append text for y axis label
    svgLineChart.append('text')
         .attr('transform', 'rotate(-90)')
         .attr('y', -45)
         .attr('x', -height/2)
         .attr('dy', '.71em')
         .style('text-anchor', 'middle')
         .text('million metric tons of CO2');
    
    // Draw line 
    svgLineChart.append("path")
        // .datum(data.filter(function(d) { return d; }))
        .datum(data)
        .attr("fill", "None")
        .attr("stroke", '#8c510a')
        .attr("stroke-width", 2)
        .attr("d", lineResidential);

     // Draw line 
     svgLineChart.append("path")
        .datum(data)
        .attr("fill", "None")
        .attr("stroke", '#d8b365')
        .attr("stroke-width", 2)
        .attr("d", lineCommercial);

    // Draw line
    svgLineChart.append("path")
        .datum(data)
        .attr("fill", "None")
        .attr("stroke", '#c7eae5')
        .attr("stroke-width", 2)
        .attr("d", lineIndustry);

    svgLineChart.append("path")
        .datum(data)
        .attr("fill", "None")
        .attr("stroke", '#5ab4ac')
        .attr("stroke-width", 2)
        .attr("d", lineTransport);

    svgLineChart.append("path")
        .datum(data)
        .attr("fill", "None")
        .attr("stroke", '#01665e')
        .attr("stroke-width", 2)
        .attr("d", lineElectricity);
    
    // // text label for the x axis
    svgLineChart.append("text")
        .attr('x', width/2)
        .attr("y", height - (height * 1.03))
        .style('text-anchor', 'middle')
        .text(state + ' (by sector)');
  });
return this;
}
})();
