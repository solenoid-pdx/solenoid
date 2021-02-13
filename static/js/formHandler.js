
const formSubmitHandler = () => {

        let inputs = inputHandler();
      
        if(inputs.blanks.length > 1) {
          flashHandler('PLEASE FILL OUT ALL THE FIELDS', 'missing-input-flash-err')
          return;
        }
        if(inputs.blanks.length <= 0) {
          flashHandler('PLEASE LEAVE A VALUE TO SOLVE FOR BLANK', 'no-solve-input-flash-err')
          return;
        }

        updateQueryString(inputs.inputs)
        
        $.ajax({
          type: 'POST',
          url: 'formHandle',
          dataType: 'json',
          data: {
            voltage: inputs.inputs[0].value,
            length: inputs.inputs[1].value,
            r0: inputs.inputs[2].value,
            ra: inputs.inputs[3].value,
            x: inputs.inputs[4].value,
            force: inputs.inputs[5].value,
            awg: inputs.inputs[6].value,
            compute: inputs.toCompute,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            length_unit: inputs.inputs[1].unit,
            r0_unit: inputs.inputs[2].unit,
            ra_unit: inputs.inputs[3].unit,
            x_unit: inputs.inputs[4].unit,
            force_unit: inputs.inputs[5].unit,
          },
            success: res => {
              result = res[res.compute];
              document.getElementById(`input-text-${res.compute}`).value = result;
            }
        });
};



