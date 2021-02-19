inputHandler = () => {
  let inputs= [
    { 'name': 'voltage', 'value': '' },
    { 'name': 'length', 'value': '', 'unit': '' },
    { 'name': 'r0', 'value': '', 'unit': '' },
    { 'name': 'ra', 'value': '', 'unit': '' },
    { 'name': 'x', 'value': '', 'unit': '' },
    { 'name': 'force', 'value': '', 'unit': '' },
    { 'name': 'awg', 'value': '' },
  ]

  let blanks = []
  let toCompute= ''

  inputs.forEach( (input, _index) => {
    let element = document.getElementById(`input-text-${input.name}`);
    let unit = document.getElementById(`input-unit-${input.name}`);

    if(element.value === '') {
      blanks.push(input.name)
      input.value = 0;
      input.answer = true;
      toCompute = input.name;
    }
    else input.value = element.value;

    if(input.name !== 'voltage' && input.name !== 'awg') {
        input.unit = unit.value
    }
  });
  
  let inputContextObj = {}
  inputContextObj['inputs'] = inputs
  inputContextObj['blanks'] = blanks
  inputContextObj['toCompute'] = toCompute

  return inputContextObj
}