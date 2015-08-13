var width = 820, //size of the chart
    barHeight = 40; //height of each bar

//function to determine the size of each bar, according to its value
var x = d3.scale.linear()
    .range([0, width]); 

//selects the svg with chart2 class and attribute 'width' as a parameter 
var chart = d3.select(".chart")
    .attr("width", width);

//loads the data into 'data'
d3.csv("https://health.data.ny.gov/resource/vbkk-tipq.csv?$select=rate&$where=measurement_year=2013 and payer= 'Commercial HMO' and domain='Adult Health' and sub_domain='Managing Preventive Care for Adults' and measure_description='Colon Cancer Screening' and (plan_name='Aetna'or plan_name='CDPHP'or plan_name='Easy Choice Health Plan of NY'or plan_name='HIP (EmblemHealth)'or plan_name='Excellus Blue Cross BlueShield'or plan_name='HealthNow New York Inc.'or plan_name='Empire BlueCross BlueShield HMO'or plan_name='Independent Health'or plan_name='MVP Health Care'or plan_name='Oxford Health Plans of New York'or plan_name='Univera Healthcare'or plan_name='Statewide Average')", type, function(error, data) {
  
  //after downloading the data file to the variable,
  //sets the domain of x. It goes from 0 to the max value in 'data'
  x.domain([0, d3.max(data, function(d) { return d.Rate; })]);

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
      .attr("width", function(d) { return x(d.Rate); })
      .attr("height", barHeight - 6);

  //for ecah bar in 'bar', it adds a 'text' tag that will place the value into the bar
  bar.append("text")
      .attr("x", function(d) { return x(d.Rate) - 3; }) //width position
      .attr("y", barHeight / 2) //positioning in the middle of the bar
      .attr("dy", ".35em") 
      .text(function(d) { return d.Rate; }); //show the value for that bar
});

//coverting the values into the column 'value' to numbers
function type(d) {
  d.Rate = +d.Rate; // coerce to number
  return d;
}
