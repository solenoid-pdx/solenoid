// TODO: Look at this later lol
let previousX;
let previousY;

const renderPage = () => {
    mountInputs();
    add_awg_select_options();
};

const mountInputs = () => {
    let form = document.getElementById("input-submit-form");
    createDropDown();
    let inputs = createInputs();
    let submit_button =
      `<input
        class="btn btn-outline-primary"
        type="submit"
        data-tooltip
        data-placement="top"
        title="Calculate With Entered Values"
        value="Calculate"
      >`
    inputs.forEach(input => {
        form.insertAdjacentHTML('beforeend', input['html']);
    });
    form.insertAdjacentHTML('beforeend', submit_button);
    
};

const createInputsContextObj = () => {
  const urlParams = new URLSearchParams(window.location.search);
  let inputs = [
    { 
      'name': 'voltage',
      'symbol': 'V',
      'value': urlParams.get('voltage') || '',
      'unit': 'volts',
      'description': 'Voltage Applied',
      'html': ''
    },
    {
      'name': 'length',
      'symbol': 'L',
      'value': urlParams.get('length') || '',
      'unit': 'mm',
      'description': 'Coil Length',
      'html': ''
    },
    {
      'name': 'r_not',
      'symbol': 'r sub not',
      'value': urlParams.get('r_not') || '',
      'unit': 'mm',
      'description': 'Inner Coil Radius',
      'html': ''
    },
    {
      'name': 'r_a',
      'symbol': 'r sub a',
      'value': urlParams.get('r_a') || '',
      'unit': 'mm',
      'description': 'Outer Coil Radius',
      'html': ''
    },
    {
      'name': 'x',
      'symbol': 'x',
      'value': urlParams.get('x') || '',
      'unit': 'mm',
      'description': 'Stroke Position (0 = Stroke Start)',
      'html': ''
    },
    {
      'name': 'force',
      'symbol': 'F',
      'value': urlParams.get('force') || '',
      'unit': 'N',
      'description': 'Force Generated',
      'html': ''
    },
    {
      'name': 'awg',
      'symbol': 'AWG',
      'value': urlParams.get('awg') || '',
      'unit': 'gauge',
      'description': 'Gauge of Coil Wire',
      'html': ''
    },
  ];

  return inputs;
}

const createInputs = () => {
    let inputs = createInputsContextObj();
    inputs.forEach( element => {
        if (element.name != 'awg') {
            element.html = `
        <div id="input-${element.name}" class="input-group mb-3">
        <div class="input-group-prepend">
          <span
            class="input-group-text"
            data-tooltip
            data-placement="top"
            title="Input For ${element.description}"
          >
            ${formatR(element.symbol)}
          </span>
        </div>
        <input type="text"
               id="input-text-${element.name}"
               class="form-control"
               aria-label="Text input with radio button"
               placeholder="Enter ${element.symbol}"
               value="${element.value}"
        >
      `
            if (element.name === 'voltage') {
                element.html +=`           
                <div class="input-group-append">
                  <span class="input-group-text">volts</span>
                </div> 
        `
            }
            if (element.name === 'length'
                || element.name === 'r0'
                || element.name === 'ra'
                || element.name === 'x') {
                element.html +=`
                <div class="input-group-append">
                  <select id="input-unit-${element.name}" class="input-group-text">
                    <option selected>mm</option>
                    <option>cm</option>
                    <option>m</option>
                    <option>inch</option>
                    <option>feet</option>
                  </select>
                </div>
        `
            }
            if (element.name === 'force') {
               element.html +=`
               <div class="input-group-append">
                 <select id="input-unit-${element.name}" class="input-group-text">
                   <option selected>N</option>
                   <option>lbf</option>
                 </select>
               </div>
        `
            }
        }
        else {
            element.html =`
            <div id="input-${element.name}" class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">${formatR(element.symbol)}</span>
            </div>   
            <input id = "input-text-awg"
                   class = "form-control"
                   list="input-text"
                   value="${element.value}" 
                   placeholder="Enter ${element.symbol}" 
            >
              <datalist id="input-text">
              </datalist>           
            <div class="input-group-append">
              <span class="input-group-text">${element.unit}</span>
              </div>
            </div> 
        `
        }
    });
    return inputs;
};

const createDropDown = () => {
  let select_X = document.getElementById("x-values-input")
  let select_Y = document.getElementById("y-values-input")
  let inputs = ['Voltage', 'Length', 'r0', 'ra', 'x', 'Force', 'AWG']
  inputs.forEach( element => {
    let option = document.createElement('option')
    option.text = `${element}`
    option.value = `${element}`
    option.id = `option-x-${element}`
    select_X.add(option)
    if(element !== 'AWG'){
      let option1 = document.createElement('option')
      option1.text = `${element}`
      option1.value = `${element}`
      option1.id = `option-y-${element}`
      select_Y.add(option1)
    }
  })
}

const populateDefaults = () => {
  document.getElementById('input-text-voltage').value = '5';
  document.getElementById('input-text-length').value = '27';
  document.getElementById('input-text-r0').value = '2.3';
  document.getElementById('input-text-ra').value = '4.5';
  document.getElementById('input-text-x').value = '0';
  document.getElementById('input-text-awg').value = '30';
  document.getElementById('input-text-force').value = '';
  document.getElementById('x-values-input').value = 'Voltage';
  document.getElementById('y-values-input').value = 'Force';
  previousX = $('#x-values-input')[0].value
  $(`#option-y-${previousX}`).hide()
  previousY = $('#y-values-input')[0].value
  $(`#option-x-${previousY}`).hide()
}

const formatR = unit => {
  if (unit == 'r sub not')
    return 'r<sub>0</sub>';
  if (unit == 'r sub a')
    return 'r<sub>a</sub>';
  return unit;
};

const updateQueryString = inputs => {
  const newUrl = new URL(window.location)
  newUrl.searchParams.forEach( (value, key) => {
    newUrl.searchParams.delete(key)
  })
  inputs.forEach( variable => {
    if (variable.value)
      newUrl.searchParams.set(variable.name, variable.value)
  })
  window.history.pushState({}, document.title, newUrl);
}
const add_awg_select_options = () =>{
    $('#input-text').append("<option>"+ '0000' + "</option>")
    $('#input-text').append("<option>"+ '000' + "</option>")
    $('#input-text').append("<option>"+ '00' + "</option>")
    for(i=0; i<41; i++){
        $("#input-text").append("<option>" + i + "</option>");
    }
};


(() => {

  $("select[name=x-values-input]").change(function() {
    $(`#option-y-${previousX}`).show()
    previousX = this.value;
    $(`#option-y-${previousX}`).hide()
  });

  $("select[name=y-values-input]").change(function() {
    $(`#option-x-${previousY}`).show()
    previousY = this.value;
    $(`#option-x-${previousY}`).hide()
  });   
})();