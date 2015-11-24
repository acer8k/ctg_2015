var selectedMeasureDescription;
var selectedYear;
var selectedPayer;

$(document).ready(function()
{
    $.getJSON( "https://health.data.ny.gov/resource/vbkk-tipq.json?$select=sub_domain&$where=payer='Commercial PPO'&$group=sub_domain&$order=sub_domain")
    .done(function( data )
    {
        var payerArray = ["blank", ""];
        payerArray.push("Commercial_HMO");
        payerArray.push("Commercial HMO");
        payerArray.push("Commercial_PPO");
        payerArray.push("Commercial PPO");
        GenerateSelectionBox(payerArray, "sbPayer", 0);

        var measureDescriptionArray = ["blank", ""];
        $.each( data, function(i, item) {
            measureDescriptionArray.push(item.sub_domain.replace(/\s/g,"_"));
            measureDescriptionArray.push(item.sub_domain);
        })
        GenerateSelectionBox(measureDescriptionArray, "sbMesureDescription", 0);

        $.getJSON( "https://health.data.ny.gov/resource/vbkk-tipq.json?$select=measurement_year&$where=payer='Commercial PPO'&$group=measurement_year&$order=measurement_year")
            .done(function( data ){
                var yearArray = ["blank", ""];
                $.each( data, function(i, item) {
                    yearArray.push(item.measurement_year.replace(/\s/g,"_"));
                    yearArray.push(item.measurement_year);
                })
                GenerateSelectionBox(yearArray, "sbYear", 0);

                initializePage();
        });
    });

    $('.draw').click(function()
    {
        preDraw();
    });
    /*$(".draw").click(function(){
            alert("The paragraph was clicked.");
    });*/
});

function initializePage()
{
    var lblPayer = $('<b><label style="margin-left:40px" for="sbPayer0">Payer: </label>');
    var lblMeasureDescription = $('<b><label style="margin-left:40px" for="sbMesureDescription0">Sub Domain: </label>');
    var lblYear = $('<b><label for="sbYear0" style="margin-left:40px">Year: </label></b>');
    $(lblPayer).insertBefore('#sbPayer0');
    $(lblMeasureDescription).insertBefore('#sbMesureDescription0');
    $(lblYear).insertBefore('#sbYear0');
    $('#sbPayer0').prop('selectedIndex', 1);
    $('#sbMesureDescription0').prop('selectedIndex', 9);
    $('#sbYear0').prop('selectedIndex', 6);
    preDraw();
}

function preDraw()
{
    selectedPayer = $('#sbPayer0').val();
    selectedMeasureDescription = $('#sbMesureDescription0').val();
    selectedYear = $('#sbYear0').val();
    d3.selectAll('h1.ex').remove();
    d3.selectAll('table').remove();
    d3.selectAll('svg').remove();
    $('body').append('<h1 style="margin-left:40px" class="ex">'+selectedPayer.replace(/_/g,' ')+' - '+selectedMeasureDescription.replace(/_/g,' ')+ ' - '+selectedYear+'</h1>');
    draw(selectedPayer.replace(/_/g,' '), selectedMeasureDescription.replace(/_/g,' '), selectedYear.replace(/_/g,' '));
}

//Helper function that generates the selection elements.
function GenerateSelectionBox (sBoxElements, pID, counter) 
{
    // Create the selection element.
    var sel = $('<select class="sBoxes" id="'+pID+counter+'"></select>');
    // loops through the array of options.
    for(index = 0; index < sBoxElements.length; index += 2)
    {
        // Append the option to the selection box.
        if(index == 0)
        {
            sel.append('<option value='+sBoxElements[index]+' selected>'+sBoxElements[index+1]+'</option>');
        }
        else
        {
            sel.append('<option value='+sBoxElements[index]+'>'+sBoxElements[index+1]+'</option>');
        }
    }
    // Append the selection box to the correct paragraph
    $(sel).insertBefore('button');
}

function draw(selectedPayer, selectedMeasureDescription, selectedYear) 
{
    //setting the margins, width and height of the svg element
      var margin = {top: 20, right: 20, bottom: 50, left: 40},
          width = 1260 - margin.left - margin.right,
          height = 575 - margin.top - margin.bottom;

      //
      var x0 = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);

      var x1 = d3.scale.ordinal();

      var y = d3.scale.linear()
          .range([height, 0]);

      var color = d3.scale.ordinal()
          .range(["#4672a6", "#a84543", "#88a34e", "#71598f", "#98bae3", "#4298ad", "#d9803d", "#8acf7c", "#869bbf", "#dea2a2", "#b9cc97"]);

      var xAxis = d3.svg.axis()
          .scale(x0)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickFormat(d3.format(".2s"));

      var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<center><span style='color:orange'>" + d.plan_name + "</span><br><strong>Rate:</strong> <span style='color:SpringGreen'>" + d.value + "</span></center>";
          })

      var svg = d3.select("body").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.call(tip);
      
      d3.json("https://health.data.ny.gov/resource/vbkk-tipq.json?$limit=50000&$select=plan_name&$where=measurement_year='"+selectedYear+"' and payer='"+selectedPayer+"' and sub_domain='"+selectedMeasureDescription+"'&$group=plan_name", function(error, data1) {
        if (error) throw error;

        var planNames = d3.values(data1).map(function(name){return name.plan_name;});
/*JIM */       console.log(planNames);
        d3.json("https://health.data.ny.gov/resource/vbkk-tipq.json?$limit=50000&$select=plan_name,measure_description,rate&$where=payer= '"+selectedPayer+"' and sub_domain='"+selectedMeasureDescription+"' and measurement_year='"+selectedYear+"'", function(error, data2) {
        
          var nested_data = d3.nest()
                .key(function(d) {return d.measure_description; })
                .entries(data2);
/*JIM */  console.log(nested_data);
  
  nested_data.forEach(function(d) {
            i=0;
            d.rates = planNames.map(function(name) { return {plan_name: name, value: +d.values[i++].rate}; });
          });

          //debugger;

          x0.domain(nested_data.map(function(name){return name.key;}));
          x1.domain(planNames).rangeRoundBands([0, x0.rangeBand()]);
          y.domain([0, d3.max(nested_data, function(d) { return d3.max(d.rates, function(d) { return d.value; }); })]);

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
              .selectAll(".tick text")
              .call(wrap, x0.rangeBand());

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Rate");

          var measures = svg.selectAll(".measures")
              .data(nested_data)
              .enter().append("g")
              .attr("class", "g")
              .attr("transform", function(d) { return "translate(" + x0(d.key) + ",0)"; });

          measures.selectAll("rect")
              .data(function(d) { return d.rates; })
              .enter().append("rect")
              .attr("width", x1.rangeBand()-2)
              .attr("x", function(d) { return x1(d.plan_name); })
              .attr("y", function(d) { return y(d.value); })
              .attr("height", function(d) { return height - y(d.value); })
              .style("fill", function(d) { if (d.plan_name=="Statewide Average")
                                            return "#000000";
                                           else
                                            return color(d.plan_name); })
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);

          measures.append("text")
              .attr("y", function(d) { return y(d.value) + 3; }) //width position
              .attr("x", x0.rangeBand()/2)
              .attr("dy", ".1em") 
              .text(function(d) { return d.value; }); //show the value for that bar

          var legend = svg.selectAll(".legend")
              .data(planNames.slice())
              .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(0," + i * 17 + ")"; });

          legend.append("rect")
              .attr("x", width - 18)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", function(d) { if (d=="Statewide Average")
                                            return "#000000";
                                           else
                                            return color(d); });

          legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d; });
        });
      });

      function wrap(text, width) {
        text.each(function() {
            var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.2, // ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }
}