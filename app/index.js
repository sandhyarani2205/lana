var chart_data = [{'key':'Task 1', 'value': 10}, {'key':'Task 2', 'value': 20},{'key':'Task 3', 'value': 140},{'key':'Task 4', 'value': 40},{'key':'Task 5', 'value': 50},
    {'key':'Task 6', 'value': 60},{'key':'Task 7', 'value': 50},{'key':'Task 8', 'value': 80},{'key':'Task 9', 'value': 190},{'key':'Task 10', 'value': 100},
    {'key':'Task 11', 'value': 12}, {'key':'Task 12', 'value': 26},{'key':'Task 13', 'value': 140},{'key':'Task 14', 'value': 44},{'key':'Task 15', 'value': 55},
    {'key':'Task 16', 'value': 67},{'key':'Task 17', 'value': 76},{'key':'Task 18', 'value': 82},{'key':'Task 19', 'value': 195},{'key':'Task 20', 'value': 100}];

color_enable = "#3FB8AF"
color_disable = "grey"

var width = document.getElementById('vis')
    .clientWidth;
var height = document.getElementById('vis')
    .clientHeight;

var margin = {
    top: 20,
    bottom: 70,
    left: 70,
    right: 20
}

var svg = d3.select('#vis')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var x_scale = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1);

var y_scale = d3.scaleLinear()
    .range([height, 0]);

var y_axis = d3.axisLeft(y_scale);
var x_axis = d3.axisBottom(x_scale);

function add_x_axis(){
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')');
}


// text label for the x axis
function add_label_x_axis(label_name){
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .style("fill", "red")
      .text(label_name);
}

function add_y_axes(){
  svg.append('g')
    .attr('class', 'y axis');
}

// text label for the y axis
function add_label_y_axes(label_name){
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "red")
      .text(label_name);  

}

function compare_activities(a, b){
  if (a.value > b.value) 
    return 1
  if (b.value > a.value) 
    return -1

  return 0
}

add_x_axis()
add_y_axes()
add_label_x_axis("Activities")
add_label_y_axes("Frequency")

function draw(left, right) {

    chart_data.sort(compare_activities);
    
    var t = d3.transition()
        .duration(500);

    var chart_values = chart_data.map(function(d) {
        return d.key;
    });
    console.log(chart_values)
    x_scale.domain(chart_values);
    var max_value = d3.max(chart_data, function(d) {
        return +d.value;
    });

    y_scale.domain([0, max_value]);
    var bars = svg.selectAll('.bar')
        .data(chart_data)

    svg.select('.x.axis')
        .call(x_axis);

    svg.select('.y.axis')
        .transition(t)
        .call(y_axis);


    svg.selectAll(".text")
   .data(chart_data)
   .enter()
   .append("text")
   .text(function(d) {
        return d.value;
   })
   .attr("x", function(d, i) {
        return x_scale(d.key) + 0.3 * (width / chart_data.length);
   })
   .attr("y", function(d) {
        return y_scale(d.value) - 5;
   });

    bars.exit().remove();

    var new_bars = bars
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
            return x_scale(d.key);
        })
        .attr('width', x_scale.bandwidth())
        .attr('y', height)
        .attr('height', 0)
    
    new_bars.merge(bars)
        .transition(t)
        .attr('y', function(d) {
            return y_scale(+d.value);
        })
        .attr('height', function(d) {
            return height - y_scale(+d.value)
        })
      .attr("fill", function(d, i ) {
    if (i+1 < left || i+1 > right) {
      return color_disable;

    }
    return color_enable;
  })
    
}

draw(1, chart_data.length);

//Add slider
var slider = document.getElementById('slider');

noUiSlider.create(slider, {
    start: [0, chart_data.length],
    connect: true,
    range: {
        'min': 1,
        'max': chart_data.length
    },
    step: 1,

    direction: 'ltr',
    orientation: 'horizontal',
    tooltips: true,
    format: wNumb({
        decimals: 0,
    }),
    pips: {
        mode: 'steps',
        stepped: true,
        density: 4
    }
});

slider.noUiSlider.on('update', function (values, handle) {
    var a = slider.noUiSlider.get();
    console.log(a);
    draw(parseInt(a[0]), parseInt(a[1]))
});