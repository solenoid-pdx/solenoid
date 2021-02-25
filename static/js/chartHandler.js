//Grabbing chart from 
let $chart_element = $("#chart-element");
var new_chart;


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
  let x_step = $('#step-input')[0].value;

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
  ];
  
  updateQueryString(values.inputs);
  updateQueryString(graphInputs);

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
            $('#chart-download-button').show();
            var ctx = $chart_element[0].getContext("2d");
            if(window.line != undefined){
              window.line.destroy();
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
