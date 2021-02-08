let $voltageChart = $("#voltage-Chart")
let compute = 'force' //Change later :) 

const voltageChartAjax = (inputs, toGraph) => {
  $.ajax({
          type: 'POST',
          url: 'voltageChart',
          dataType: 'json',
          data: {
            voltage: inputs[0].value,
            length: inputs[1].value,
            r_not: inputs[2].value,
            r_a: inputs[3].value,
            x: inputs[4].value,
            force: inputs[5].value,
            awg: inputs[6].value,
            compute: 'force', //Change this later, currently just comparing vs force tho
            toGraph: toGraph,
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
                    document.getElementById(`input-text-${toGraph}`).value = label
                    document.getElementById(`input-text-${compute}`).value = value 
                    console.log('Label', label)
                    console.log('Value', value)
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
                  text: `Force vs ${format(data.x)}`
                },
                scales: {
                   xAxes: [{ display: true, scaleLabel: { display: true, fontSize:20, labelString: format(data.x)}}],
                   yAxes: [{ display: true, scaleLabel: { display: true, fontSize:20, labelString: 'Force'}}]
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
  }
  return input
}

