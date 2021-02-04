
const voltageChartAjax = (inputs, toGraph) => {
  let $voltageChart = $("#voltage-Chart")
  // let inputs = getInputs()

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

            var ctx = $voltageChart[0].getContext("2d");
            if(window.line != undefined){
              window.line.destroy()
            }
            window.line = new Chart(ctx, {
             type: 'line',
              data: {
                labels: data.labels,
                datasets: [{
                  label: 'Force',
                  backgroundColor: 'green',
                  borderColor: 'green',
                  data: data.data,
                  fill: false,
               }]          
             },
              options: {
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