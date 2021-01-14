const formSubmitHandler = () => {

        let inputs = [
          { 'name': 'voltage', 'value': '' },
          { 'name': 'length', 'value': '' },
          { 'name': 'turns', 'value': '' },
          { 'name': 'alpha', 'value': '' },
          { 'name': 'gamma', 'value': '' },
          { 'name': 'r_not', 'value': '' },
          { 'name': 'r_a', 'value': '' },
          { 'name': 'x', 'value': '' },
          { 'name': 'force', 'value': '' },
          { 'name': 'awg', 'value': '' },
        ];

        let blank_counter = 0;
        let to_compute = '';

        inputs.forEach( (input, _index) => {
          let element = document.getElementById(`input-text-${input.name}`);
          if(element.value === '' ) {
            blank_counter += 1;
            input.value = 0;
            input.answer = true;
            to_compute = input.name;
            console.log(to_compute);
          }
          else input.value = element.value;
        });

        if(blank_counter > 1) {
          alert('PLEASE FILL OUT ALL FIELDS');
          return;
        }
        if(blank_counter <= 0) {
          alert('PLEASE LEAVE A VALUE TO SOLVE FOR BLANK');
          return;
        } 
        
        $.ajax({
          type: 'POST',
          url: 'formHandle',
          dataType: 'json',
          data: {
            voltage: inputs[0].value,
            length: inputs[1].value,
            turns: inputs[2].value,
            alpha: inputs[3].value,
            gamma: inputs[4].value,
            r_not: inputs[5].value,
            r_a: inputs[6].value,
            x: inputs[7].value,
            force: inputs[8].value,
            awg: inputs[9].value,
            compute: to_compute,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
          },
            success: res => {
              result = res[res.compute];
              document.getElementById(`input-text-${res.compute}`).value = result;
            }
        });
};