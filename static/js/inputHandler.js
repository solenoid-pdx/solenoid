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
  // let xGraph = $('#x-values-input :selected').text() //Should I just put these down where they are added? why have 2 lines when u can have 1?
  // let yGraph = $('#y-values-input :selected').text()

  inputs.forEach( (input, _index) => {
    let element = document.getElementById(`input-text-${input.name}`);
    // let radio = document.getElementById(`input-radio-${input.name}`);

    if(element.value === '') {
      blanks.push(input.name)
      input.value = 0;
      input.answer = true;
      toCompute = input.name;
    }
    else input.value = element.value;

    // if(radio && radio.checked){
    //   xGraph = input.name;
    //   if(element.value === ''){
    //     input.value = 0;
    //     blanks.push(input.name)
    //   }
    // }
  });
  
  let inputContextObj = {}

  inputContextObj['inputs'] = inputs
  inputContextObj['blanks'] = blanks
  inputContextObj['toCompute'] = toCompute
  // inputContextObj['xGraph'] = xGraph
  // inputContextObj['yGraph'] = yGraph

  return inputContextObj
}