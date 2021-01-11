const formSubmitHandler = () => {

        let inputs = [
            { 'unit': 'volts', 'value': '' },
            { 'unit': 'mm', 'value': '' },
            { 'unit': 'turns', 'value': '' },
            { 'unit': 'units', 'value': '' },
            { 'unit': 'units', 'value': '' },
            { 'unit': 'mm', 'value': '' },
            { 'unit': 'mm', 'value': '' },
            { 'unit': 'units', 'value': '' },
            { 'unit': 'N', 'value': '' },
        ];

        inputs.forEach( (element, index) => {
            let input_val = $(`#input-text-${index}`).val();
            if(input_val === '' ) element.value = '0';
            else element.value = input_val;
        });

        $.ajax({
          type: 'POST',
          url: 'calculate',
          dataType: 'json',
          data: {
            V: inputs[0].value,
            L: inputs[1].value,
            N: inputs[2].value,
            ALPHA: inputs[3].value,
            GAMMA: inputs[4].value,
            R0: inputs[5].value,
            Ra: inputs[6].value,
            X: inputs[7].value,
            F: inputs[8].value,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
          },
            success: () => {
                console.log('success!');
            }
        });
};