inputHandler = () => {
  let inputs= [
    { 'name': 'voltage', 'value': '' },
    { 'name': 'length', 'value': '' },
    { 'name': 'r0', 'value': '' },
    { 'name': 'ra', 'value': '' },
    { 'name': 'x', 'value': '' },
    { 'name': 'force', 'value': '' },
    { 'name': 'awg', 'value': '' },
    { 'name': 'relative_permeability', 'value': ''}
  ]

  let blanks = []
  let toCompute= ''

  inputs.forEach( (input, _index) => {
    let element = document.getElementById(`input-text-${input.name}`);

    if(element.value === '') {
      blanks.push(input.name)
      input.value = 0;
      input.answer = true;
      toCompute = input.name;
    }
    else input.value = element.value;
  });
  
  let inputContextObj = {}
  inputContextObj['inputs'] = inputs
  inputContextObj['blanks'] = blanks
  inputContextObj['toCompute'] = toCompute

  return inputContextObj
}