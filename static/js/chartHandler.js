//Grabbing chart from 
let $chart_element = $("#chart-element");
var new_chart;

//Downloads a png, only appears after you hit graph. 
//Creates anchor tag -> converts the chart to a png
//Forces click, and a download should happen
const chartDownload = () => {
  let a = document.createElement('a');
  a.href = new_chart.toBase64Image();
  a.download = 'chart.png';
  a.click();
};

//Handles the slider and x-value ranges that are to be graphed
const graphRange = (x_value) => {

  //Order matters because we access with an int
  //jquery slider struggles with mins that aren't 0, and maxes that == 100
  let ranges = [
    { name: 'Voltage', min: '0', max: '99', default_min: '1', default_max: '30', step: 1 },
    { name: 'Length', min: '0', max: '99', default_min: '10', default_max: '30', step: 1 },
    { name: 'r0', min: '0', max: '99', default_min: '2', default_max: '25', step: 0.1 },
    { name: 'ra', min: '0', max: '99', default_min: '3', default_max: '5', step: 0.1 },
    { name: 'x', min: '0', max: '99', default_min: '0', default_max: '10', step: 1 },
    { name: 'Force', min: '0', max: '99', default_min: '5', default_max: '20', step: 1 },
    { name: 'AWG', min: '0', max: '40', default_min: '26', default_max: '40', step: 1 },
    { name: 'relative_permeability', min: '0', max: '200000', default_min: '100', default_max: '10000', step: 100},
  ];
  //Grabs the query string data
  const urlParams = new URLSearchParams(window.location.search);

  //Asserts if input forms are not loaded
  const not_loaded = $('#input-text-ra')[0] === undefined;

  //Limits max value of r0 to ra's current value, since the r0 < ra 
  if (x_value === 2) {
      //If the page isn't fully loaded then get the data from query string.
      ranges[2].max = not_loaded ? urlParams.get('ra') : $('#input-text-ra')[0].value;
      ranges[2].default_max = not_loaded ? urlParams.get('ra') : $('#input-text-ra')[0].value;
  }

  //Limits max value of x to lengths current value, since the x < length
  if (x_value === 4) {
    ranges[4].max = not_loaded ? urlParams.get('length') : $('#input-text-length')[0].value;
    ranges[4].default_max = not_loaded ? urlParams.get('length') : $('#input-text-length')[0].value;
  }

  //Jquery slider, for information can be found here:  https://jqueryui.com/slider/#range
  $('#slider-range').slider({
    range: true,
    min: ranges[x_value].min,
    max: ranges[x_value].max,
    step: ranges[x_value].step,
    values: [ ranges[x_value].default_min, ranges[x_value].default_max ],
    slide: (event, ui) => {
      if (event.originalEvent) {
        $('#x-value-range').val(ui.values[0] + ' - ' + ui.values[1]);
      }
    },
  });
  $('#x-value-range').val(
    $('#slider-range').slider('values', 0) +' - ' + $('#slider-range').slider('values', 1)
  );
  let slider_min = $('#slider-range').slider('values', 0);
  let slider_max = $('#slider-range').slider('values', 1);
  $('#step-input')[0].max = slider_max - slider_min - 0.01;
};


//Creates chart
const chartHandler = () => {
  let values = inputHandler();

  //User inputs from drop downs and sliders needed for the graph
  let x_graph = $('#x-values-input :selected').text().toLowerCase();
  let y_graph = $('#y-values-input :selected').text().toLowerCase();
  let x_start = $('#slider-range').slider("values")[0];
  let x_end = $('#slider-range').slider("values")[1];
  let x_step = $('#step-input')[0].value;

  values.blanks = values.blanks.filter(i => i !== x_graph && i !== y_graph);

  //-------------------------Error handling-----------------------------
 
  //If defaults
  if(x_graph === 'Select X Value' || y_graph === 'Select Y Value'){
    flashHandler('PLEASE SELECT X AND Y VALUES', 'same-selections-flash-err');
    return;
  }

  //Needing correct inputs from the text-inputs
  if(values.blanks.length >= 1) {
    flashHandler(`ALL VALUES OTHER THAN ${x_graph} AND ${y_graph} NEED TO BE FILLED `, 'missing-input-flash-err');
    return;
  }

  //x vs length is unable to graph
  if(x_graph === 'x' && y_graph === 'length'){
    flashHandler(`UNABLE TO GRAPH X VS LENGTH, PLEASE CHOOSE OTHER VALUES `, 'x-vs-length-input-flash-err');
    return;
  }

  const graphInputs = [
    {'name': 'x_graph', 'value': x_graph},
    {'name': 'y_graph', 'value': y_graph},
    {'name': 'step', 'value': x_step}
  ];
  
  updateQueryString(values.inputs);
  updateQueryString(graphInputs);

  //Ajax request, with the success being the graph
  $.ajax({
          type: 'POST',
          url: 'chartHandle',
          dataType: 'json',
          data: {
            voltage: values.inputs[0].value,
            length: values.inputs[1].value,
            r0: values.inputs[2].value,
            ra: values.inputs[3].value,
            x: values.inputs[4].value,
            force: values.inputs[5].value,
            awg: values.inputs[6].value,
            relative_permeability: values.inputs[7].value, //Add new field DPN-31 FE
            compute: y_graph, 
            x_graph: x_graph,
            x_start: x_start,
            x_end:  x_end,
            x_step: x_step,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            length_unit: values.inputs[1].unit,
            r0_unit: values.inputs[2].unit,
            ra_unit: values.inputs[3].unit,
            x_unit: values.inputs[4].unit,
            force_unit: values.inputs[5].unit,
          },
          success: function (data) {
            //Displaying both the graph element, and the button for downloading the graph
            document.getElementById('graph-container').style = 'width: 100%; display: block;';
            $('#chart-download-button').show();
            var ctx = $chart_element[0].getContext("2d");

            //Delete previous graph if one exist, page will attempt to load both on top of each other w/o. 
            if(window.line != undefined){
              window.line.destroy();
            }
            
            //Creating a new chart/graph. Docs are here: https://www.chartjs.org/
            new_chart = window.line = new Chart(ctx, {
             type: 'line',
              data: {
                labels: data.labels,
                datasets: [{
                  label: format(data.y),
                  backgroundColor: 'green',
                  borderColor: 'green',
                  data: data.data,
                  fill: false,
                  pointRadius: 5,
                  pointHoverRadius: 5, 
               }]          
             },
              options: {
                //Grabs the graphs x-y variables and puts them in the input fields
                'onClick': (evt, item) => {
                  let activePoints = new_chart.getElementsAtEvent(evt);
                  if(activePoints[0]){
                    let clicked_element_index = activePoints[0]['_index'];
                    let label = new_chart.data.labels[clicked_element_index];
                    let value = new_chart.data.datasets[0].data[clicked_element_index];
                    document.getElementById(`input-text-${x_graph.toLowerCase()}`).value = label;
                    document.getElementById(`input-text-${y_graph.toLowerCase()}`).value = value;
                  }
                },
                tooltips: {
                  mode: 'nearest',
                  intersect: false,
                },
                responsive: true,
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  fontSize: 20,
                  text: `${format(data.y)} vs ${format(data.x)}`
                },
                scales: {
                   xAxes: [{ display: true, scaleLabel: { display: true, fontSize:20, labelString: format(data.x)}}],
                   yAxes: [{ display: true, scaleLabel: { display: true, fontSize:20, labelString: format(data.y)}}]
              }}
            });
          }
          
        });
}

//Displays proper styling of variables for title and axis labels.
const format = input => {
  if(input === SolenoidParameters.R0){
    return "r\u2080";
  }else if(input === SolenoidParameters.RA){
    return "r\u2090" ;
  }
  else if(input === SolenoidParameters.PERMEABILITY){
    return "Relative Permeability";
  }
  return input.charAt(0).toUpperCase() + input.slice(1);
}
