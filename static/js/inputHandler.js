inputHandler = () => {
  let inputs= [
    { 'name': 'voltage', 'value': '' },
    { 'name': 'length', 'value': '' },
    { 'name': 'r_not', 'value': '' },
    { 'name': 'r_a', 'value': '' },
    { 'name': 'x', 'value': '' },
    { 'name': 'force', 'value': '' },
    { 'name': 'awg', 'value': '' },
  ]

  let blanks = []
  let toCompute= ''
  let toGraph= ''

  inputs.forEach( (input, _index) => {
    let element = document.getElementById(`input-text-${input.name}`);
    let radio = document.getElementById(`input-radio-${input.name}`);

    if(element.value === '' && !radio.checked ) {
      blanks.push(input.name)
      input.value = 0;
      input.answer = true;
      toCompute = input.name;
    }
    else input.value = element.value;

    if(radio && radio.checked){
      toGraph = input.name;
      if(element.value === ''){
        input.value = 0;
        blanks.push(input.name)
      }
    }
  });
  
  let inputContextObj = {}

  inputContextObj['inputs'] = inputs
  inputContextObj['blanks'] = blanks
  inputContextObj['toCompute'] = toCompute
  inputContextObj['toGraph'] = toGraph

  return inputContextObj
}