inputHandler = () => {
  let inputs= [
    { 'name': SolenoidParameters.VOLTAGE, 'value': '' },
    { 'name': SolenoidParameters.LENGTH, 'value': '', 'unit': '' },
    { 'name': SolenoidParameters.R0, 'value': '', 'unit': '' },
    { 'name': SolenoidParameters.RA, 'value': '', 'unit': '' },
    { 'name': SolenoidParameters.X, 'value': '', 'unit': '' },
    { 'name': SolenoidParameters.FORCE, 'value': '', 'unit': '' },
    { 'name': SolenoidParameters.AWG, 'value': '' },
    { 'name': SolenoidParameters.PERMEABILITY, 'value': ''}
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

    if(input.name !== SolenoidParameters.VOLTAGE && input.name !== SolenoidParameters.AWG && input.name !== SolenoidParameters.PERMEABILITY) {
        input.unit = unit.value
    }
  });
  
  let inputContextObj = {}
  inputContextObj['inputs'] = inputs
  inputContextObj['blanks'] = blanks
  inputContextObj['toCompute'] = toCompute

  return inputContextObj
}