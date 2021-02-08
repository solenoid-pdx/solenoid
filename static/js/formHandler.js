
const formSubmitHandler = () => {

        let inputs = inputHandler();
        console.log(inputs.blanks.length)
        // Blank counter  == 2 || 0.
        if(((inputs.blanks.length < 3 && inputs.blanks.length !== 1) && inputs.toGraph !== '')){
          if( inputs.blanks.length === 2 && !inputs.blanks.includes(inputs.toGraph)){
            if(document.getElementById('missing-input-flash-err') == undefined) {
              let err = 
                `<div id="missing-input-flash-err" class="alert alert-danger alert-dismissible fade show" role="alert">
                  <span><strong>Invalid Input:</strong> PLEASE FILL OUT ONE OF THESE FIELDS ${inputs.blanks[0]} OR ${inputs.blanks[1]} .</span>
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

          voltageChartAjax(inputs.inputs, inputs.toGraph)
          return;
        }
        if(inputs.blanks.length > 1) {
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
        if(inputs.blanks.length <= 0) {
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
        if(inputs.toCompute !== 'force' && inputs.inputs[4].value != 0) {
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
        if(inputs.toCompute === 'x') {
          if(document.getElementById('unsolved-x-flash-err') == undefined) {
            let err = 
              `<div id="unsolved-x-flash-err" class="alert alert-danger alert-dismissible fade show" role="alert">
                <span><strong>Invalid Input:</strong> X CANNOT BE SOLVED FOR.</span>
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

        voltageChartAjax(inputs.inputs, inputs.toGraph)
        updateQueryString(inputs.inputs)
        
        $.ajax({
          type: 'POST',
          url: 'formHandle',
          dataType: 'json',
          data: {
            voltage: inputs.inputs[0].value,
            length: inputs.inputs[1].value,
            r_not: inputs.inputs[2].value,
            r_a: inputs.inputs[3].value,
            x: inputs.inputs[4].value,
            force: inputs.inputs[5].value,
            awg: inputs.inputs[6].value,
            compute: inputs.toCompute,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
          },
            success: res => {
              result = res[res.compute];
              document.getElementById(`input-text-${res.compute}`).value = result;
            }
        });
};



