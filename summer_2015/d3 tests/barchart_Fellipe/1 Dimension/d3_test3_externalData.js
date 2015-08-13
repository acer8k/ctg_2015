/*var data = [
              {name: "Locke", value: 4},
              {name: "Reyes", value: 8},
              {name: "Ford", value: 15},
              {name: "Jarrah", value: 16},
              {name: "Shephard", value: 23},
              {name: "Kwon", value: 42}
            ];*/
var width = 420, //size of the chart
    barHeight = 20; //height of each bar

//function to determine the size of each bar, according to its value
var x = d3.scale.linear()
    .range([0, width]); 

//selects the svg with chart2 class and attribute 'width' as a parameter 
var chart = d3.select(".chart4")
    .attr("width", width);

//loads the data into 'data'
d3.tsv("barchart_test_data.tsv", type, function(error, data) {
  
  //after downloading the data file to the variable,
  //sets the domain of x. It goes from 0 to the max value in 'data'
  x.domain([0, d3.max(data, function(d) { return d.value; })]);

  //sets the height of chart2 according to how many data we have and the 'barHeight' of each bar 
  chart.attr("height", barHeight * data.length);

  //for each line in 'data', it adds a new 'g' tag with the attribute 'transform' setted as "translate (0,[i*barHeight])"" in order to express where
  //the new bar should start. This will create a 'bar' array
  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  //for each bar in 'bar', it adds a 'rect' tag with attributes width (determined by the function x() depending on its value in 'bar'),
  //and a height attribute with barHeight - 1 to give the bars a little space between
  bar.append("rect")
      .attr("width", function(d) { return x(d.value); })
      .attr("height", barHeight - 1);

  //for ecah bar in 'bar', it adds a 'text' tag that will place the value into the bar
  bar.append("text")
      .attr("x", function(d) { return x(d.value) - 3; }) //width position
      .attr("y", barHeight / 2) //positioning in the middle of the bar
      .attr("dy", ".35em") 
      .text(function(d) { return d.value; }); //show the value for that bar
});

//coverting the values into the column 'value' to numbers
function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}
