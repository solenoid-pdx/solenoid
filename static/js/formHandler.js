
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
        // let blank = []
        let to_compute = '';
        let toGraph = '';
        let selected = false;

        inputs.forEach( (input, _index) => {
          let element = document.getElementById(`input-text-${input.name}`);
          let radio = document.getElementById(`input-radio-${input.name}`);
          if(element.value === '' && !radio.checked ) {
            blank_counter += 1;
            input.value = 0;
            input.answer = true;
            to_compute = input.name;
            // blank.push(input.name);
          }
          else input.value = element.value;

          if(radio.checked){
            selected = true;
            toGraph = input.name;
            // if(element.value === ''){
            //   blank.push(input.name)
            // }
          }
        });


        if(blank_counter > 2 || (blank_counter === 2 && selected === false)) {
          if(document.getElementById('missing-input-flash-err') == undefined) {
            let err = 
              `<div id="missing-input-flash-err" class="alert alert-danger alert-dismissible fade show" role="alert">
                <span><strong>Invalid Input:</strong> PLEASE FILL OUT ALL THE FIELDS.</span>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>

              </div>`
            document
              .getElementById('flash-container')
              .insertAdjacentHTML('afterend', err);
          }
          return;
        }
        if(blank_counter <= 0) {
          if(document.getElementById('no-solve-input-flash-err') == undefined) {
            let err = 
              `<div id="no-solve-input-flash-err" class="alert alert-danger alert-dismissible fade show" role="alert">
                <span><strong>Invalid Input:</strong> PLEASE LEAVE A VALUE TO SOLVE FOR BLANK.</span>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>

              </div>`
            document
              .getElementById('flash-container')
              .insertAdjacentHTML('beforeend', err);
          }
          return;
        } 
        if(to_compute !== 'force' && inputs[4].value != 0) {
          if(document.getElementById('x-eq-zero-flash-err') == undefined) {
            let err = 
              `<div id="x-eq-zero-flash-err" class="alert alert-danger alert-dismissible fade show" role="alert">
                <span><strong>Invalid Input:</strong> X MUST EQUAL 0 FOR THIS SOLUTION.</span>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>

              </div>`
            document
              .getElementById('flash-container')
              .insertAdjacentHTML('beforeend', err);
          }
          return;
        }
        // if(to_compute === 'x') {
        //   if(document.getElementById('unsolved-x-flash-err') == undefined) {
        //     let err = 
        //       `<div id="unsolved-x-flash-err" class="alert alert-danger alert-dismissible fade show" role="alert">
        //         <span><strong>Invalid Input:</strong> X CANNOT BE SOLVED FOR.</span>
        //         <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        //         <span aria-hidden="true">&times;</span>
        //         </button>

        //       </div>`
        //     document
        //       .getElementById('flash-container')
        //       .insertAdjacentHTML('beforeend', err);
        //   }
        //   return;
        // } 
        voltageChartAjax(inputs, toGraph)

        updateQueryString(inputs)
        
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
            toGraph: toGraph,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
          },
            success: res => {
              result = res[res.compute];
              document.getElementById(`input-text-${res.compute}`).value = result;
              document.getElementById('graph-container').style = 'width: 100%; display: block;';
            }
        });
};



