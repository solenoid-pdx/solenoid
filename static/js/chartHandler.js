let $voltageChart = $("#voltage-Chart");
let compute = 'force' //Change later :) 
var newChart;

const chartHandler = () => {
  let values = inputHandler();
  let xGraph = $('#x-values-input :selected').text().toLowerCase();
  let yGraph = $('#y-values-input :selected').text().toLowerCase();
  let xStart = $('#slider-range').slider("values")[0];
  let xEnd = $('#slider-range').slider("values")[1];
  let xStep = $('#step-input')[0].value

  values.blanks = values.blanks.filter(i => i !== xGraph && i !== yGraph);

  if(xGraph === 'Select X Value' || yGraph === 'Select Y Value'){
    flashHandler('PLEASE SELECT X AND Y VALUES', 'same-selections-flash-err');
    return;
  }

  if(values.blanks.length >= 1) {
    flashHandler(`ALL VALUES OTHER THAN ${xGraph} AND ${yGraph} NEED TO BE FILLED `, 'missing-input-flash-err');
    return;
  }
  if(xGraph === 'x' && yGraph === 'length'){
    flashHandler(`UNABLE TO GRAPH X VS LENGTH, PLEASE CHOOSE OTHER VALUES `, 'x-vs-length-input-flash-err');
    return;
  }

  const queryStringInputs = [
    {'name': 'x_graph', 'value': xGraph},
    {'name': 'y_graph', 'value': yGraph},
    {'name': 'x_start', 'value': xStart},
    {'name': 'x_end', 'value': xEnd},
    {'name': 'step', 'value': xStep}
  ]
  
  updateQueryString(queryStringInputs)

  $.ajax({
          type: 'POST',
          url: 'voltageChart',
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
            compute: yGraph, 
            xGraph: xGraph,
            xStart: xStart,
            xEnd:  xEnd,
            xStep: xStep,
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
            var ctx = $voltageChart[0].getContext("2d");
            if(window.line != undefined){
              window.line.destroy()
            }
            newChart = window.line = new Chart(ctx, {
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
                  let activePoints = newChart.getElementsAtEvent(evt)
                  if(activePoints[0]){
                    let clickedElementIndex = activePoints[0]['_index']
                    let label = newChart.data.labels[clickedElementIndex]
                    let value = newChart.data.datasets[0].data[clickedElementIndex]
                    document.getElementById(`input-text-${xGraph.toLowerCase()}`).value = label
                    document.getElementById(`input-text-${yGraph.toLowerCase()}`).value = value 
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
