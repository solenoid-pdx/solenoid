const formSubmitHandler = () => {

        let inputs = [
          { 'name': 'voltage', 'value': '' },
          { 'name': 'length', 'value': '' },
          { 'name': 'r_not', 'value': '' },
          { 'name': 'r_a', 'value': '' },
          { 'name': 'x', 'value': '' },
          { 'name': 'force', 'value': '' },
          { 'name': 'awg', 'value': '' },
        ];

        let blank_counter = 0;
        let to_compute = '';
        let toGraph = '';

        inputs.forEach( (input, _index) => {
          let element = document.getElementById(`input-text-${input.name}`);
          let radio = document.getElementById(`input-radio-${input.name}`);
          if(element.value === '' ) {
            blank_counter += 1;
            input.value = 0;
            input.answer = true;
            to_compute = input.name;
            // console.log(to_compute);
          }
          else input.value = element.value;

          if(radio.checked){
            toGraph = input.name;
            // console.log(input.name);
          }
        });

        if(to_compute !== 'force' && inputs['x'] !== 0) {
          alert('X MUST BE 0.');
          inputs[4].value = 0;
        }
        if(to_compute === 'x') {
          alert('X CANNOT BE SOLVED FOR.');
          return;
        }

        if(blank_counter > 1) {
          alert('PLEASE FILL OUT ALL FIELDS');
          return;
        }
        if(blank_counter <= 0) {
          alert('PLEASE LEAVE A VALUE TO SOLVE FOR BLANK');
          return;
        } 
        voltageChartAjax(inputs, toGraph)
        $.ajax({
          type: 'POST',
          url: 'formHandle',
          dataType: 'json',
          data: {
            voltage: inputs[0].value,
            length: inputs[1].value,
            r_not: inputs[2].value,
            r_a: inputs[3].value,
            x: inputs[4].value,
            force: inputs[5].value,
            awg: inputs[6].value,
            compute: to_compute,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
          },
            success: res => {
              result = res[res.compute];
              document.getElementById(`input-text-${res.compute}`).value = result;
            }
        });
};

function voltageChartAjax(inputs, toGraph){
  let $voltageChart = $("#voltage-Chart");
  console.log(toGraph)
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

            new Chart(ctx, {
             type: 'line',
              data: {
                labels: data.labels,
                datasets: [{
                  label: 'Force',
                  backgroundColor: 'green',
                  data: data.data
               }]          
             },
              options: {
                responsive: true,
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: `Force vs ${toGraph}`
                },
                scales: {
                   xAxes: [{ display: true, scaleLabel: { display: true, labelString: toGraph}}],
                   yAxes: [{ display: true, scaleLabel: { display: true, labelString: 'Force'}}]
              }}
            });

          }
        });
}