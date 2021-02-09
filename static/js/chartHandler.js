let $voltageChart = $("#voltage-Chart")
let compute = 'force' //Change later :) 

const chartHandler = () => {
  let values = inputHandler()
  let xGraph = $('#x-values-input :selected').text()
  let yGraph = $('#y-values-input :selected').text()

  //This won't be needed once I finish onChange function for the select elements.
  if(xGraph === yGraph){
    flashHandler('PLEASE SELECT DIFFERENT X AND Y VALUES', 'same-selections-flash-err') 
    return;
  }
  
  if(xGraph === 'Select X Value' || yGraph === 'Select Y Value'){
    flashHandler('PLEASE SELECT X AND Y VALUES', 'same-selections-flash-err') 
    return;
  }
  if(values.blanks.length >= 2 && (!values.blanks.includes(xGraph.toLowerCase()) || !values.blanks.includes(yGraph.toLowerCase()))) {
    flashHandler(`ALL VALUES OTHER THAN ${xGraph} AND ${yGraph} NEED TO BE FILLED `, 'missing-input-flash-err')
    return;
  }
  if(values.toCompute !== 'force' && values.inputs[4].value != 0) {
    flashHandler('X MUST EQUAL 0 FOR THIS SOLUTION.', 'x-eq-zero-flash-err')
    return;
  }
  if(values.toCompute === 'x') {
    flashHandler('X CANNOT BE SOLVED FOR', 'unsolved-x-flash-err')
    return;
  }



  $.ajax({
          type: 'POST',
          url: 'voltageChart',
          dataType: 'json',
          data: {
            voltage: values.inputs[0].value,
            length: values.inputs[1].value,
            r_not: values.inputs[2].value,
            r_a: values.inputs[3].value,
            x: values.inputs[4].value,
            force: values.inputs[5].value,
            awg: values.inputs[6].value,
            compute: yGraph, 
            xGraph: xGraph,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
          },
          success: function (data) {
            document.getElementById('graph-container').style = 'width: 100%; display: block;';
            var ctx = $voltageChart[0].getContext("2d");
            if(window.line != undefined){
              window.line.destroy()
            }
            let newChart = window.line = new Chart(ctx, {
             type: 'line',
              data: {
                labels: data.labels,
                datasets: [{
                  label: 'Force',
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
  if(input === 'r_not'){
    return 'r\u2080'
  }else if(input === 'r_a'){
    return "r\u2090" 
  }else if(input === 'force'){
    return "Force"
  }
  return input
}

