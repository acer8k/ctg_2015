

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////// T A B L E ///////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
function tabulate(data, columns) {
    var table = d3.select("body").append("table")
            .attr("style", "margin-left: 100px")
            .attr("style", "font-family: Tahoma")
            .style("border-collapse", "collapse")
            .style('background-color', 'lightgoldenrodyellow')

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

    var cells = rows.selectAll('td')
        .data(function(row) {
            return columns.map(function (column) {
                return { column: column, value: row[column] }
            })
        })
        .enter()
        .append('td')
        .text(function (d) { return d.value })

    return table;
}
    // ?$limit=50000
    //https://health.data.ny.gov/resource/vbkk-tipq.csv?$limit=50000

    // https://health.data.ny.gov/resource/vbkk-tipq.csv?$select=*&$where=sub_domain='Caring for Children and Adolescents with Illnesses'
d3.csv("https://health.data.ny.gov/resource/vbkk-tipq.csv?$select=*&$where=measure_description='Use of Appropriate Medications for People with Asthma (Ages 12-18)' and measurement_year='2013' and payer= 'Commercial HMO'",function (data) {
    var qarrdata = tabulate(data,['Plan Name','Rate']);

    ////////////// BAR CHART ///////////////////////
    x.domain(data.map(function(d) { return d['Plan Name']; }));
    y.domain([0, d3.max(data, function(d) { return d['Rate']; })]);

    svg.append("text")
        .attr("class", "title")
        .attr("x", x(data[0].plan_Name))
        .attr("y", -26)
    //  .text("Rates by Commercial HMO for Year 2013");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll(".tick text")
        .call(wrap, x.rangeBand());

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d['Plan Name']); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d['Rate']); })
        .attr("height", function(d) { return height - y(d['Rate']); });

    ////

    qarrdata.selectAll("tbody tr")
        .sort(function(a,b){
            return d3.descending(a["Rate"],b["Rate"]);
        });

    qarrdata.selectAll("thead th")
        .text(function(column) {
            return column.charAt(0).toUpperCase()+column.substr(1);
        });
})

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////// BAR CHART ///////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

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


var margin = {top: 80, right: 180, bottom: 80, left: 180},
    width = 1190 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1, .3);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
// .ticks(8, "%");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


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