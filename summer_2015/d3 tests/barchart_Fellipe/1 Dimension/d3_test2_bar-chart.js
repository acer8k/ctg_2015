var data = [4,8,15,16,23,42];

    //We set the svg element’s size in JavaScript so that we can compute the height based on the size of the dataset (data.length). This way, the size is based on the height of each bar rather than the overall height of the chart, and we ensure adequate room for labels.
    var width = 420;
        barHeigth = 20;

    //fit stuff
    var x = d3.scale.linear()
            .domain([0, d3.max(data)])
            .range([0,width]);

    //creates a chart with the 'width' and 'barChart' dimensions. Blank space
    var chart = d3.select(".chart1")
                .attr("width",width)
                .attr("height",barHeigth*data.length);

    var bar = chart.selectAll("g")
              .data(data)
              .enter().append("g")
              .attr("transform", function (d,i){return "translate(0,"+i*barHeigth+")";});

    bar.append("rect")
        .attr("width", x)
        .attr("height", barHeigth-1);

    bar.append("text")
        .attr("x", function(d){return x(d)-3;})
        .attr("y", barHeigth/2)
        .attr("dy", ".35em")
        .text(function(d){return d;});