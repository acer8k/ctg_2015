var selectedMeasureDescription;
var selectedYear;

$(document).ready(function()
{
    $.getJSON( "https://health.data.ny.gov/resource/vbkk-tipq.json?$select=measure_description&$where=payer='Commercial HMO'&$group=measure_description&$order=measure_description")
    .done(function( data )
    {
        var measureDescriptionArray = ["blank", ""];
        $.each( data, function(i, item) {
            measureDescriptionArray.push(item.measure_description.replace(/\s/g,"_"));
            measureDescriptionArray.push(item.measure_description);
        })
        GenerateSelectionBox(measureDescriptionArray, "sbMeasureDescription", 0);

        $.getJSON( "https://health.data.ny.gov/resource/vbkk-tipq.json?$select=measurement_year&$where=payer='Commercial HMO'&$group=measurement_year&$order=measurement_year")
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
        if($('#sbMeasureDescription0').val() != "blank" && $('#sbYear0').val() != "blank" )
        {
            preDraw();
        }
        else
        {
            alert("You can't have a blank selection.");
        }
    });
});

function initializePage()
{
    var lblMeasureDescription = $('<label for="sbMeasureDescription0">Measure Description: </label>');
    var lblYear = $('<label for="sbYear0">Year: </label>');
    $(lblMeasureDescription).insertBefore('#sbMeasureDescription0');
    $(lblYear).insertBefore('#sbYear0');
    $('#sbMeasureDescription0').prop('selectedIndex', 1);
    $('#sbYear0').prop('selectedIndex', 6);
    preDraw();
}

function preDraw()
{
    selectedMeasureDescription = $('#sbMeasureDescription0').val();
    selectedYear = $('#sbYear0').val();
    $('p.ex').remove();
    $('table').remove();
    $('svg').remove();  
    draw(selectedMeasureDescription.replace(/_/g,' '), selectedYear.replace(/_/g,' '));    
}

function draw(selectedMeasureDescription, selectedYear) 
{
    d3.csv("https://health.data.ny.gov/resource/vbkk-tipq.csv?$select=*&$where=measure_description='"+selectedMeasureDescription+"' and measurement_year='"+selectedYear+"' and payer= 'Commercial HMO'", type, function(error, data) 
    {
        //debugger;
        if(data.length==0)
        {
            d3.selectAll('p.ex').remove();
            $('body').append('<p class="ex" style="color:red">No entries for this Query, try again. </p>');
            console.log('empty data');
            return;
        }

        
        $('body').append('<p class="ex" style="display:none">'+selectedMeasureDescription.replace(/_/g,' ')+' - Commercial HMO - ' +selectedYear+ '</p>');

        var margin = {top: 20, right: 5, bottom: 80, left: 30},
        width = 850 - margin.left - margin.right,
        height = 620 - margin.top - margin.bottom;

        var color = d3.scale.linear()
        .domain([-0.25, 0, 0.25])
        .range(["red", "#333333", "LawnGreen"]);

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1, .3);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");


        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("display", "none")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var qarrdata = tabulate(data,['Plan Name',selectedMeasureDescription]);

            qarrdata.selectAll("tbody tr")
                .sort(function(a,b){
                    return d3.ascending(a["Rate"],b["Rate"]);
                });

            qarrdata.selectAll("thead th")
                .text(function(column) {
                    return column.charAt(0).toUpperCase()+column.substr(1);
                });

        var statewideRate = data[data.length-1].Rate;

        x.domain(data.map(function(d) { return d['Plan Name']; }));
        y.domain([0, d3.max(data, function(d) { return d['Rate']; })]);

        var bar = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("class","barText");

        bar.append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d['Plan Name']); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d['Rate']); })
            .attr("height", function(d) { return height - y(d['Rate']); })
            .style("fill", function(d){ return color((d.Rate - statewideRate)/200)})
            .style("opacity", "0.95");

        bar.append("text")
            .attr("x", function(d) { return x(d['Plan Name'])+(x.rangeBand()/2)+15; })
            .attr("y", function(d) { return y(d['Rate'])+15})
            .text(function(d) { return d['Rate'];});

        svg.append("text")
        .attr("class", "title")
        .attr("x", x(data[0].plan_Name))
        .attr("y", -26)

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll(".tick text")
            .call(wrap, x.rangeBand());

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        $('p.ex').fadeIn("slow");
        $('table').fadeIn("slow");
        $('g').fadeIn("slow");
    });
}

function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
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

function type(d) {
    d['Rate'] = +d['Rate'];
    return d;
}

function tabulate(data, columns) {
    var table = d3.select("body").append("table")
            .attr("style", "margin-left: 100px")
            .attr("style", "font-family: Tahoma")
            .style("display", "none")
            .style("border-collapse", "collapse")
            .style('background-color', 'lightgoldenrodyellow');

    thead = table.append("thead"),
    tbody = table.append("tbody");


    thead.append('tr')
        .selectAll('th')
        .data(columns)
        .enter()
        .append('th')
        .text(function(column) { return column; });

    var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
        .style("background-color", function(d){if(d['Plan Name']=="Statewide Average"){return "#A0A0A0"}})

    var cells = rows.selectAll('td')
        .data(function(row) {
            return columns.map(function (column) {
                if(row[column]==undefined){
                    column = 'Rate';
                }
                return { column: column, value: row[column] }
            })
        })
        .enter()
        .append('td')
        .text(function (d) { return d.value })

    return table;
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