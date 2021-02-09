
const SolenoidParameters = {
  VOLTAGE: "voltage",
  LENGTH: "length",
  R_NOT: "r_not",
  R_A: "r_a",
  X: "x",
  FORCE: "force",
  AWG: "awg",
  PERMEABILITY:"relative_permeability",
}

const renderPage = () => {
    mountInputs();
    add_awg_select_options();
};

const mountInputs = () => {
    let form = document.getElementById("input-submit-form");
    let inputs = createInputs();
    let submit_button = '<input class="btn btn-outline-primary" type="submit" value="Calculate">'
    inputs.forEach(input => {
        form.insertAdjacentHTML('beforeend', input['html']);
    });
    form.insertAdjacentHTML('beforeend', submit_button);
};

const createInputs = () => {
    const urlParams = new URLSearchParams(window.location.search)

    let inputs = [
        { 'name': 'voltage', 'symbol': 'V', 'value': urlParams.get(SolenoidParameters.VOLTAGE) || '', 'unit': 'volts', 'html': '' },
        { 'name': 'length', 'symbol': 'L', 'value': urlParams.get(SolenoidParameters.LENGTH) || '', 'unit': 'mm', 'html': '' },
        { 'name': 'r_not', 'symbol': 'r sub not', 'value': urlParams.get(SolenoidParameters.R_NOT) || '', 'unit': 'mm', 'html': '' },
        { 'name': 'r_a', 'symbol': 'r sub a', 'value': urlParams.get(SolenoidParameters.R_A) || '', 'unit': 'mm', 'html': '' },
        { 'name': 'x', 'symbol': 'x', 'value': urlParams.get(SolenoidParameters.X) || '', 'unit': 'mm', 'html': '' },
        { 'name': 'force', 'symbol': 'F', 'value': urlParams.get(SolenoidParameters.FORCE) || '', 'unit': 'N', 'html': '' },
        { 'name': 'awg', 'symbol': 'AWG', 'value': urlParams.get(SolenoidParameters.AWG) || '', 'unit': 'guage', 'html': '' },
        { 'name': 'relative_permeability', 'symbol': 'PERMEABILITY', 'value': urlParams.get(SolenoidParameters.PERMEABILITY) || '', 'unit': 'mu', 'html': '' },
    ];
    inputs.forEach( element => {
        // console.log(html, index+1);
        if (element.name != 'awg') {
            element.html = `
        <div id="input-${element.name}" class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text">${formatR(element.symbol)}</span>
          <div class="input-group-text">
            <input id="input-radio-${element.name}" type="radio" onclick="clickMe(this.value)" value="${element.name}" aria-label="Radio button for following text input" name="radAnswer">
          </div>
        </div>
        <input type="text"
               id="input-text-${element.name}"
               class="form-control"
               aria-label="Text input with radio button"
               placeholder="Enter ${element.symbol}"
               value="${element.value}"
        >
        <div class="input-group-append">
            <span class="input-group-text">${element.unit}</span>
          </div>
        </div>
      `
        }
        else {
            element.html =`
            <div id="input-${element.name}" class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">${formatR(element.symbol)}</span>
              <div class="input-group-text">
                <input type="radio" aria-label="Radio button for following text input" name="radAnswer">
              </div>
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

const populateDefaults = () => {
  document.getElementById('input-text-relative_permeability').value = '350';
  document.getElementById('input-text-voltage').value = '5';
  document.getElementById('input-text-length').value = '27';
  document.getElementById('input-text-r_not').value = '2.3';
  document.getElementById('input-text-r_a').value = '4.5';
  document.getElementById('input-text-x').value = '0';
  document.getElementById('input-text-awg').value = '30';
  document.getElementById('input-text-force').value = '';
  document.getElementById('input-radio-voltage').checked = true;
}

const formatR = unit => {
  if (unit == 'r sub not')
    return 'r<sub>0</sub>';
  if (unit == 'r sub a')
    return 'r<sub>a</sub>';
  return unit;
};

const updateQueryString = formInputs => {
  const newUrl = new URL(window.location)
  newUrl.searchParams.forEach( (value, key) => {
    newUrl.searchParams.delete(key)
  })
  formInputs.forEach( variable => {
    if(variable.value) {
      newUrl.searchParams.set(variable.name, variable.value)
    }
  })
  window.history.pushState({}, document.title, newUrl);
}

const add_awg_select_options =() =>{
    $('#input-text').append("<option>"+ '0000' + "</option>")
    $('#input-text').append("<option>"+ '000' + "</option>")
    $('#input-text').append("<option>"+ '00' + "</option>")
    for(i=0; i<41; i++){
        $("#input-text").append("<option>" + i + "</option>");
    }
};
