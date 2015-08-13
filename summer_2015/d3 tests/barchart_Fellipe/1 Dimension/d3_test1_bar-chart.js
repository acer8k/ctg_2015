//var div = document.createElement("div");
//div.innerHTML = "Hello World!";
//document.body.appendChild(div);

//create the chart div
var chart_div = d3.select("body").append("div");
chart_div.attr("class", "chart");

//chart data (bars' values)
var data = [1, 10, 20, 25, 30, 42, 15, 25, 40, 60, 100];

//selects all the div inside of the chart div, empty so far
var bar = chart_div.selectAll("div");

//Think of the initial selection as declaring the elements you want to exist
var barUpdate = bar.data(data);

//append to each data object a DOM element "div"
var barEnter = barUpdate.enter().append("div");

//for each barEnter element, style the width with the correspondent
// px (data value*10)
//barEnter.style("width",function(d){return d*10+"px";});

//function to return the value from the data in a pixel scale
var x = d3.scale.linear().domain([0,d3.max(data)]).range([0,420]);
barEnter.style("width",function(d){return x(d)+"px";});

//set the content of each barEnter element
barEnter.text(function(d){return d;});