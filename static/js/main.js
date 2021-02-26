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
let previousX;
let previousY;

const renderPage = () => {
  mountInputs();
  createDropDown();
  addAwgSelectOptions();
  dropDownPermeability();
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

const createInputContextObj = () => {
  const urlParams = new URLSearchParams(window.location.search);
  let inputs = [
    {
      name: SolenoidParameters.VOLTAGE,
      symbol: 'V',
      value: urlParams.get('voltage') || '',
      unit: 'volts',
      description: 'Voltage Applied',
      html: '',
    },
    {
      name: SolenoidParameters.LENGTH,
      symbol: 'L',
      value: urlParams.get('length') || '',
      unit: urlParams.get(`${SolenoidParameters.LENGTH}_unit`) || 'mm',
      description: 'Coil Length',
      html: '',
    },
    {
      name: SolenoidParameters.R0,
      symbol: 'r sub not',
      value: urlParams.get('r0') || '',
      unit: urlParams.get(`${SolenoidParameters.R0}_unit`) || 'mm',
      description: 'Inner Coil Radius',
      html: '',
    },
    {
      name: SolenoidParameters.RA,
      symbol: 'r sub a',
      value: urlParams.get('ra') || '',
      unit: urlParams.get(`${SolenoidParameters.RA}_unit`) || 'mm',
      description: 'Outer Coil Radius',
      html: '',
    },
    {
      name: SolenoidParameters.X,
      symbol: 'x',
      value: urlParams.get('x') || '',
      unit: urlParams.get(`${SolenoidParameters.X}_unit`) || 'mm',
      description: 'Stroke Position (0 = Stroke Start)',
      html: '',
    },
    {
      name: SolenoidParameters.FORCE,
      symbol: 'F',
      value: urlParams.get('force') || '',
      unit: urlParams.get(`${SolenoidParameters.FORCE}_unit`) || 'N',
      description: 'Force Generated',
      html: '',
    },
    {
      name: SolenoidParameters.AWG,
      symbol: 'AWG',
      value: urlParams.get('awg') || '',
      unit: 'ga',
      description: 'Gauge of Coil Wire',
      html: '',
    },
    {
      name: SolenoidParameters.PERMEABILITY,
      symbol: 'μ',
      value: urlParams.get(SolenoidParameters.PERMEABILITY) || '',
      description: 'Permeability of the Core',
      unit: '',
      html: '',
    },
  ];
  return inputs;
};

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

  let default_input = `
    <input type="text"
      id="input-text-${element.name}"
      class="form-control"
      placeholder="Enter ${element.symbol}"
      value="${element.value}"
    >
    ${formatVariableUnits(element)}
  `;

  let datalist_input = `
    <input id = "input-text-${element.name}"
      class = "form-control"
      list="dropdown-text-${element.name}"
      value="${element.value}" 
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
                <option ${element.unit === 'mm' ? 'selected' : ''}>mm</option>
                <option ${element.unit === 'cm' ? 'selected' : ''}>cm</option>
                <option ${element.unit === 'm' ? 'selected' : ''}>m</option>
                <option ${element.unit === 'inch' ? 'selected' : ''}>inch</option>
                <option ${element.unit === 'feet' ? 'selected' : ''}>feet</option>
              </select>
            </div>
    `;
    return variable_units;
  }
  if (element.name === SolenoidParameters.FORCE) {
    let force_units = `
            <div class="input-group-append">
              <select id="input-unit-${element.name}" class="input-group-text">
                <option ${element.unit === 'N' ? 'selected' : ''}>N</option>
                <option ${element.unit === 'lbf' ? 'selected' : ''}>lbf</option>
              </select>
            </div>
    `;
    return force_units;
  }
};

const createDropDown = () => {
  const urlParams = new URLSearchParams(window.location.search);
  let select_X = document.getElementById('x-values-input');
  let select_Y = document.getElementById('y-values-input');
  let inputs = [
    'Voltage',
    'Length',
    SolenoidParameters.R0,
    SolenoidParameters.RA,
    SolenoidParameters.X,
    'Force',
    SolenoidParameters.AWG.toUpperCase(),
    SolenoidParameters.PERMEABILITY,
  ];
  inputs.forEach((element) => {
    let option = document.createElement('option');
    option.text = `${element}`;
    if (element === SolenoidParameters.PERMEABILITY) {
      option.text = 'Relative Permeability';
    }
    option.value = `${element}`;
    option.id = `option-x-${element}`;
    select_X.add(option);
    if (urlParams.get('x_graph') === element.toLowerCase()) {
      select_X.value = element
      previousX = $('#x-values-input')[0].value;
      $(`#option-y-${previousX}`).hide();
      $('#x-value-range-label')[0].textContent = `${element} range`;
      graphRange($('select[name=x-values-input')[0].selectedIndex - 1);
    }
    if (element !== 'AWG') {
      let option1 = document.createElement('option');
      option1.text = `${element}`;
      if (element === SolenoidParameters.PERMEABILITY) {
        option1.text = 'Relative Permeability';
      }
      option1.value = `${element}`;
      option1.id = `option-y-${element}`;
      select_Y.add(option1);
      if (urlParams.get('y_graph') === element.toLowerCase()) {
        select_Y.value = element
        previousY = $('#y-values-input')[0].value;
        $(`#option-x-${previousY}`).hide();
      }
    }
  });

  const stepInput = urlParams.get('step')
  if (stepInput) {
    document.getElementById('step-input').value = stepInput
  }
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

const formatR = (unit) => {
  if (unit == 'r sub not') return 'r<sub>0</sub>';
  if (unit == 'r sub a') return 'r<sub>a</sub>';
  return unit;
};

//Updates the query string from 'onClick()' functions in 'Graph' and 'Calculate'
const updateQueryString = (inputs) => {
  const newUrl = new URL(window.location);
  inputs.forEach( input => {
    newUrl.searchParams.delete(input.name);
    newUrl.searchParams.set(input.name, input.value);
    if (input.unit) {
      newUrl.searchParams.delete(`${input.name}_unit`);
      newUrl.searchParams.set(`${input.name}_unit`, input.unit);
    }
  });
  window.history.pushState({}, document.title, newUrl);
};

const addAwgSelectOptions = () => {
  $('#dropdown-text-awg').append('<option>' + '0000' + '</option>');
  $('#dropdown-text-awg').append('<option>' + '000' + '</option>');
  $('#dropdown-text-awg').append('<option>' + '00' + '</option>');
  for (let i = 0; i < 41; i++) {
    $('#dropdown-text-awg').append('<option>' + i + '</option>');
  }
};


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


(() => {
  $('select[name=x-values-input]').change(() => {
    $(`#option-y-${previousX}`).show();
    previousX = $('select[name=x-values-input]')[0].value;
    $('#x-value-range-label')[0].textContent =`${previousX} range:` ;
    graphRange($('select[name=x-values-input')[0].selectedIndex - 1);
    $(`#option-y-${previousX}`).hide();
  });

  $('select[name=y-values-input]').change(() => {
    $(`#option-x-${previousY}`).show();
    previousY = $('select[name=y-values-input')[0].value;
    $(`#option-x-${previousY}`).hide();
  });
})();