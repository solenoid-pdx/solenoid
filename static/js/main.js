const SolenoidParameters = {
  VOLTAGE: 'voltage',
  LENGTH: 'length',
  R0: 'r0',
  RA: 'ra',
  X: 'x',
  FORCE: 'force',
  AWG: 'awg',
  PERMEABILITY: 'relative_permeability',
};

// TODO: Look at this later lol
const renderPage = () => {
  mountInputs();
  createDropDown();
  addAwgSelectOptions();
  dropDownPermeability();
  setQueryStringValues();
};

const mountInputs = () => {
  let form = document.getElementById('input-submit-form');
  let inputs = createInputs();
  let submit_button =
    '<input class="btn btn-outline-primary" type="submit" value="Calculate">';
  inputs.forEach((input) => {
    form.insertAdjacentHTML('beforeend', input['html']);
  });
  form.insertAdjacentHTML('beforeend', submit_button);
};

// Create a context object to hold data to populate input elements with.
// Input object retrieve values from query string if exists.
const createInputContextObj = () => {
  const urlParams = new URLSearchParams(window.location.search);
  let inputs = [
    {
      name: SolenoidParameters.VOLTAGE,
      symbol: 'V',
      unit: 'volts',
      description: 'Voltage Applied',
      html: '',
    },
    {
      name: SolenoidParameters.LENGTH,
      symbol: 'L',
      unit: 'mm',
      description: 'Coil Length',
      html: '',
    },
    {
      name: SolenoidParameters.R0,
      symbol: 'r0',
      unit: 'mm',
      description: 'Inner Coil Radius',
      html: '',
    },
    {
      name: SolenoidParameters.RA,
      symbol: 'ra',
      unit: 'mm',
      description: 'Outer Coil Radius',
      html: '',
    },
    {
      name: SolenoidParameters.X,
      symbol: 'x',
      unit: 'mm',
      description: 'Stroke Position (0 = Stroke Start)',
      html: '',
    },
    {
      name: SolenoidParameters.FORCE,
      symbol: 'F',
      unit: 'N',
      description: 'Force Generated',
      html: '',
    },
    {
      name: SolenoidParameters.AWG,
      symbol: 'AWG',
      unit: 'ga',
      description: 'Gauge of Coil Wire',
      html: '',
    },
    {
      name: SolenoidParameters.PERMEABILITY,
      symbol: 'μ',
      description: 'Permeability of the Core',
      unit: '',
      html: '',
    },
  ];
  return inputs;
};

// begin create/format inputs to display
const createInputs = () => {
  let inputs = createInputContextObj();
  inputs.forEach((element) => {
      element.html = `
        <div id="input-${element.name}" class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text"
              data-toggle="tooltip"
              data-placement="left"
              title="${element.description}"
            >${formatR(element.symbol)}</span>
          </div>   
          ${formatInputs(element)} 
        </div>
      `;
  });

  $(() => {
    $('[data-toggle="tooltip"]').tooltip();
  });
  return inputs;
};

const formatInputs = (element) => {
  let name = element.name;

  // for text type inputs
  let default_input = `
    <input type="text"
      id="input-text-${element.name}"
      class="form-control"
      placeholder="Enter ${element.symbol}"
    >
    ${formatVariableUnits(element)}
  `;

  // for select type inputs
  let datalist_input = `
    <input id = "input-text-${element.name}"
      class = "form-control"
      list="dropdown-text-${element.name}"
      placeholder="Enter ${element.symbol}" 
    >
    <datalist id="dropdown-text-${element.name}">
    </datalist>           
  `
  if (name === SolenoidParameters.AWG) {
    datalist_input += `
      <div class="input-group-append">
        <span class="input-group-text">${element.unit}</span>
      </div>
    `;
  }
  return (name === SolenoidParameters.AWG || name === SolenoidParameters.PERMEABILITY) ? datalist_input : default_input;
};

// formatting for selectable unit values
const formatVariableUnits = (element) => {
  if (element.name === SolenoidParameters.VOLTAGE) {
     let voltage_units = `           
            <div class="input-group-append">
              <span class="input-group-text">volts</span>
            </div> 
    `;
    return voltage_units;
  }
  if (
    element.name === SolenoidParameters.LENGTH ||
    element.name === SolenoidParameters.R0 ||
    element.name === SolenoidParameters.RA ||
    element.name === SolenoidParameters.X
  ) {
    let variable_units = `
            <div class="input-group-append">
              <select id="input-unit-${element.name}" class="input-group-text">
                <option selected>mm</option>
                <option>cm</option>
                <option>m</option>
                <option>inch</option>
                <option>feet</option>
              </select>
            </div>
    `;
    return variable_units;
  }
  if (element.name === SolenoidParameters.FORCE) {
    let force_units = `
            <div class="input-group-append">
              <select id="input-unit-${element.name}" class="input-group-text">
                <option selected>N</option>
                <option>lbf</option>
              </select>
            </div>
    `;
    return force_units;
  }
};

const formatR = (unit) => {
  if (unit == 'r0') return 'r<sub>0</sub>';
  if (unit == 'ra') return 'r<sub>a</sub>';
  return unit;
};

//This sets all the values to values gathered from the research paper, which allows for quick initial use
const populateDefaults = () => {
  document.getElementById(`input-text-${SolenoidParameters.PERMEABILITY}`).value = '350';
  document.getElementById(`input-text-${SolenoidParameters.VOLTAGE}`).value = '5';
  document.getElementById(`input-text-${SolenoidParameters.LENGTH}`).value = '27';
  document.getElementById(`input-text-${SolenoidParameters.R0}`).value = '2.3';
  document.getElementById(`input-text-${SolenoidParameters.RA}`).value = '4.5';
  document.getElementById(`input-text-${SolenoidParameters.X}`).value = '0';
  document.getElementById(`input-text-${SolenoidParameters.AWG}`).value = '30';
  document.getElementById(`input-text-${SolenoidParameters.FORCE}`).value = '';
  document.getElementById('x-values-input').value = 'Voltage';
  document.getElementById('y-values-input').value = 'Force';
  document.getElementById('step-input').value = '1';
  previousX = $('#x-values-input')[0].value;
  $(`#option-y-${previousX}`).hide();
  previousY = $('#y-values-input')[0].value;
  $(`#option-x-${previousY}`).hide();
  $('#x-value-range-label')[0].textContent = 'Voltage range';
  graphRange(0);
};

// updates the query string when new calculation/graph is submitted
const updateQueryString = (inputs) => {
  const newUrl = new URL(window.location);
  inputs.forEach( input => {
    newUrl.searchParams.delete(input.name);
    newUrl.searchParams.set(input.name, input.value);
    if (input.unit) { // Check if value has a unit to be set
      newUrl.searchParams.delete(`${input.name}_unit`);
      newUrl.searchParams.set(`${input.name}_unit`, input.unit);
    }
  });
  // Update the url
  window.history.pushState({}, document.title, newUrl);
};

// Sets the values on the page equal to that in the query string
const setQueryStringValues = () => {
  const urlParams = new URLSearchParams(window.location.search);
  // Set form values
  Object.values(SolenoidParameters).forEach( (solenoidParameter) => {
    const queryStringValue = urlParams.get(solenoidParameter)
    if (queryStringValue !== null) {
      document.getElementById(`input-text-${solenoidParameter}`).value = queryStringValue
    }
    // Set unit values
    const queryStringUnitValue = urlParams.get(`${solenoidParameter}_unit`)
    if (queryStringUnitValue !== null) {
      document.getElementById(`input-unit-${solenoidParameter}`).value = queryStringUnitValue
    }
  })
  // Set graphing values
  const stepValue = urlParams.get('step')
  if(stepValue !== null) {
    document.getElementById('step-input').value = stepValue
  }
};

//Set the AWG drop down option values
const addAwgSelectOptions = () => {
  $('#dropdown-text-awg').append('<option>' + '0000' + '</option>');
  $('#dropdown-text-awg').append('<option>' + '000' + '</option>');
  $('#dropdown-text-awg').append('<option>' + '00' + '</option>');
  for (let i = 0; i < 41; i++) {
    $('#dropdown-text-awg').append('<option>' + i + '</option>');
  }
};

//Set the Permeability drop down option values
const dropDownPermeability = () => {
  let items = [
    { name: 'carbon steel', value: '100' },
    { name: 'nickel', value: '100' },
    { name: 'magnetic iron', value: '200' },
    { name: 'ferrite (magnesium manganese zinc)', value: '350' },
    { name: 'electrical steel', value: '4000' },
    { name: 'iron (99.8% pure)', value: '5000' },
    { name: 'permalloy (75% nickel, 21.5% iron)', value: '8000' },
    {
      name: 'mumetal (75% nickel, 2% chromium, 5% copper, 18% iron)',
      value: '200000',
    },
  ];
  items.forEach((item) => {
    let option = document.createElement('option');
    option.text = item.name;
    option.value = item.value;
    $(`#dropdown-text-${SolenoidParameters.PERMEABILITY}`).append(option);
  });
};

