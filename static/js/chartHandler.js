//Grabbing chart from 
let $chart_element = $("#chart-element");
var new_chart;


const graphRange = (x_value) => {
  let ranges = [
    { name: 'Voltage', min: '0', max: '99', dMin: '1', dMax: '30', step: '1' },
    { name: 'Length', min: '0', max: '99', dMin: '10', dMax: '30', step: '1' },
    { name: 'r0', min: '0', max: '99', dMin: '2', dMax: '25', step: '0.1' },
    { name: 'ra', min: '0', max: '99', dMin: '3', dMax: '5', step: '0.1' },
    { name: 'x', min: '0', max: '99', dMin: '0', dMax: '10', step: '1' },
    { name: 'Force', min: '0', max: '99', dMin: '5', dMax: '20', step: '1' },
    { name: 'AWG', min: '0', max: '40', dMin: '26', dMax: '40', step: '1' },
    { name: 'relative_permeability', min: '0', max: '200000', dMin: '100', dMax: '10000', step: '100'},
  ];

  const url_params = new URLSearchParams(window.location.search);
  const not_loaded = $('#input-text-ra')[0] === undefined
  if (x_value === 2) {
      ranges[2].max = not_loaded ? url_params.get('ra') : $('#input-text-ra')[0].value
      ranges[2].dMax = not_loaded ? url_params.get('ra') : $('#input-text-ra')[0].value
  }
  if (x_value === 4) {
    ranges[4].max = not_loaded ? url_params.get('length') : $('#input-text-length')[0].value 
    ranges[4].dMax = not_loaded ? url_params.get('length') : $('#input-text-length')[0].value 
  }
  $('#slider-range').slider({
    range: true,
    min: ranges[x_value].min,
    max: ranges[x_value].max,
    step: url_params.get('step') ? parseFloat(url_params.get('step')) : findStep(x_value),
    values: [
      url_params.get('x_start') ? parseFloat(url_params.get('x_start')) : ranges[x_value].dMin,
      url_params.get('x_end') ? parseFloat(url_params.get('x_end')) : ranges[x_value].dMax
    ],
    slide: (event, ui) => {
      //Maybe add a symbol to the range values so that it can say 7N, or 8 Volts - 20 Volts
      if (event.originalEvent) {
        $('#x-value-range').val(ui.values[0] + ' - ' + ui.values[1]);
      }
    },
  });
  $('#x-value-range').val(
    $('#slider-range').slider('values', 0) +
      ' - ' +
      $('#slider-range').slider('values', 1)
  );
  let slider_min = $('#slider-range').slider('values', 0);
  let slider_max = $('#slider-range').slider('values', 1);
  $('#step-input')[0].max = slider_max - slider_min - 0.01;
};

const findStep = (x_value) => {
  if (x_value === 2 || x_value === 3) {
    return 0.1;
  }
  if (x_value === 7) {
    return 100;
  }
  return 1;
};
const chartDownload = () => {
  let a = document.createElement('a');
  a.href = new_chart.toBase64Image();
  a.download = 'chart.png';
  a.click();
};

const chartHandler = () => {
  let values = inputHandler();
  let x_graph = $('#x-values-input :selected').text().toLowerCase();
  let y_graph = $('#y-values-input :selected').text().toLowerCase();
  let x_start = $('#slider-range').slider("values")[0];
  let x_end = $('#slider-range').slider("values")[1];
  let x_step = $('#step-input')[0].value

  values.blanks = values.blanks.filter(i => i !== x_graph && i !== y_graph);

  if(x_graph === 'Select X Value' || y_graph === 'Select Y Value'){
    flashHandler('PLEASE SELECT X AND Y VALUES', 'same-selections-flash-err');
    return;
  }

  if(values.blanks.length >= 1) {
    flashHandler(`ALL VALUES OTHER THAN ${x_graph} AND ${y_graph} NEED TO BE FILLED `, 'missing-input-flash-err');
    return;
  }
  if(x_graph === 'x' && y_graph === 'length'){
    flashHandler(`UNABLE TO GRAPH X VS LENGTH, PLEASE CHOOSE OTHER VALUES `, 'x-vs-length-input-flash-err');
    return;
  }

  const graphInputs = [
    {'name': 'x_graph', 'value': x_graph},
    {'name': 'y_graph', 'value': y_graph},
    {'name': 'x_start', 'value': x_start},
    {'name': 'x_end', 'value': x_end},
    {'name': 'step', 'value': x_step}
  ]
  
  updateQueryString(values.inputs)
  updateQueryString(graphInputs)

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
            document.getElementById('graph-container').style = 'width: 100%; display: block;';
            $('#chart-download-button').show()
            var ctx = $chart_element[0].getContext("2d");
            if(window.line != undefined){
              window.line.destroy()
            }
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
                'onClick': (evt, item) => {
                  let activePoints = new_chart.getElementsAtEvent(evt)
                  if(activePoints[0]){
                    let clicked_element_index = activePoints[0]['_index']
                    let label = new_chart.data.labels[clicked_element_index]
                    let value = new_chart.data.datasets[0].data[clicked_element_index]
                    document.getElementById(`input-text-${x_graph.toLowerCase()}`).value = label
                    document.getElementById(`input-text-${y_graph.toLowerCase()}`).value = value 
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
const format = input => {
  if(input === SolenoidParameters.R0){
    return 'r\u2080'
  }else if(input === SolenoidParameters.RA){
    return "r\u2090" 
  }
  else if(input === SolenoidParameters.PERMEABILITY){
    return "Relative Permeability"
  }

  return input.charAt(0).toUpperCase() + input.slice(1) 
}
