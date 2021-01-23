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

        inputs.forEach( (input, _index) => {
          let element = document.getElementById(`input-text-${input.name}`);
          if(element.value === '' ) {
            blank_counter += 1;
            input.value = 0;
            input.answer = true;
            to_compute = input.name;
          }
          else input.value = element.value;
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
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
          },
            success: res => {
              result = res[res.compute];
              console.log(res)
              document.getElementById(`input-text-${res.compute}`).value = result;
            }
        });
};


const updateQueryString = inputs => {
  const currentParams = new URLSearchParams(window.location.search)
  const newUrl = new URL(window.location);
  inputs.forEach( variable => {
    if(variable.value && currentParams.get(variable.name != variable.value)) {
      newUrl.searchParams.set(variable.name, variable.value)
    }
  })
  window.history.pushState({}, document.title, newUrl);
} 