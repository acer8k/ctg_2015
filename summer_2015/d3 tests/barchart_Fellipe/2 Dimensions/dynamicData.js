    var margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = 1000 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .5);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("https://health.data.ny.gov/resource/vbkk-tipq.csv?$select=measure_description,rate&$where=measurement_year=2013 and payer= 'Commercial HMO'and (plan_name='Statewide Average') and (measure_description='Colon Cancer Screening' or measure_description='Adult BMI Assessment'or measure_description='Flu Shot for Adults'or measure_description='Discussion of Aspirin Risks and Benefits'or measure_description='Aspirin Use')", type, function(error, data) {

      x.domain(data.map(function(d) { return d["Measure Description"]; }));
      y.domain([0, d3.max(data, function(d) { return d.Rate; })]);

      chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      chart.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      chart.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d["Measure Description"]); })
          .attr("y", function(d) { return y(d.Rate); })
          .attr("height", function(d) { return height - y(d.Rate); })
          .attr("width", x.rangeBand());
    });

    function type(d) {
      d.Rate = +d.Rate; // coerce to number
      return d;
    }