
const SolenoidParameters = {
  VOLTAGE: "voltage",
  LENGTH: "length",
  R0: "r0",
  RA: "ra",
  X: "x",
  FORCE: "force",
  AWG: "awg",
  PERMEABILITY: "relative_permeability",
}

// TODO: Look at this later lol
let previousX;
let previousY;

const renderPage = () => {
    mountInputs();
    addAwgSelectOptions();
    dropDownPermeability();
};

const mountInputs = () => {
    let form = document.getElementById("input-submit-form");
    createDropDown();
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
        { 'name': SolenoidParameters.VOLTAGE, 'symbol': 'V', 'value': urlParams.get(SolenoidParameters.VOLTAGE) || '', 'unit': 'volts', 'html': '' },
        { 'name': SolenoidParameters.LENGTH, 'symbol': 'L', 'value': urlParams.get(SolenoidParameters.LENGTH) || '', 'unit': 'mm', 'html': '' },
        { 'name': SolenoidParameters.R0, 'symbol': 'r sub not', 'value': urlParams.get(SolenoidParameters.R0) || '', 'unit': 'mm', 'html': '' },
        { 'name': SolenoidParameters.RA, 'symbol': 'r sub a', 'value': urlParams.get(SolenoidParameters.RA) || '', 'unit': 'mm', 'html': '' },
        { 'name': SolenoidParameters.X, 'symbol': 'x', 'value': urlParams.get(SolenoidParameters.X) || '', 'unit': 'mm', 'html': '' },
        { 'name': SolenoidParameters.FORCE, 'symbol': 'F', 'value': urlParams.get(SolenoidParameters.FORCE) || '', 'unit': 'N', 'html': '' },
        { 'name': SolenoidParameters.AWG, 'symbol': 'AWG', 'value': urlParams.get(SolenoidParameters.AWG) || '', 'unit': 'gauge', 'html': '' },
        { 'name': SolenoidParameters.PERMEABILITY, 'symbol': 'PERMEABILITY', 'value': urlParams.get(SolenoidParameters.PERMEABILITY) || '', 'unit': '', 'html': '' },
    ];
    inputs.forEach( element => {
        if (element.name == SolenoidParameters.AWG) {
                element.html =`
            <div id="input-${element.name}" class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">${formatR(element.symbol)}</span>
            </div>   
            <input id = "input-text-awg"
                   class = "form-control"
                   list="dropdown-text-awg"
                   value="${element.value}" 
                   placeholder="Enter ${element.symbol}" 
            >
              <datalist id="dropdown-text-awg">
              </datalist>           
            <div class="input-group-append">
              <span class="input-group-text">${element.unit}</span>
              </div>
            </div> 
        `
        }
        else if(element.name == SolenoidParameters.PERMEABILITY){
           element.html =`
            <div id="input-${element.name}" class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">${formatR(element.symbol)}</span>
            </div>   
            <input 
                    id = "input-text-relative_permeability"
                   class = "form-control"
                   list="dropdown-text-relative_permeability"
                   value="${element.value}" 
                   placeholder="Enter ${element.symbol}" 
            >
              <datalist id="dropdown-text-relative_permeability">
              </datalist>           
            <div class="input-group-append">
              <span class="input-group-text">${element.unit}</span>
              </div>
            </div> 
        `
        }
        else {
           element.html = `
        <div id="input-${element.name}" class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text">${formatR(element.symbol)}</span>
        </div>
        <input type="text"
               id="input-text-${element.name}"
               class="form-control"
               aria-label="Text input with radio button"
               placeholder="Enter ${element.symbol}"
               value="${element.value}"
        >
      `
            if (element.name === SolenoidParameters.VOLTAGE) {
                element.html +=`           
                <div class="input-group-append">
                  <span class="input-group-text">volts</span>
                </div> 
        `
            }
            if (element.name === SolenoidParameters.LENGTH
                || element.name === SolenoidParameters.R0
                || element.name === SolenoidParameters.RA
                || element.name === SolenoidParameters.X) {
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
            if (element.name === SolenoidParameters.FORCE) {
                element.html += `
               <div class="input-group-append">
                 <select id="input-unit-${element.name}" class="input-group-text">
                   <option selected>N</option>
                   <option>lbf</option>
                 </select>
               </div>
        `
            }
        }
    });
    return inputs;
};

const createDropDown = () => {
  let select_X = document.getElementById("x-values-input")
  let select_Y = document.getElementById("y-values-input")
  let inputs = ['Voltage', 'Length', SolenoidParameters.R0, SolenoidParameters.RA, SolenoidParameters.X, 'Force', SolenoidParameters.AWG.toUpperCase(), SolenoidParameters.PERMEABILITY]
  inputs.forEach( element => {
    let option = document.createElement('option')
    option.text = `${element}`
    if(element === SolenoidParameters.PERMEABILITY){
        option.text = "Relative Permeability"
    }
    option.value = `${element}`
    option.id = `option-x-${element}`
    select_X.add(option)
    if(element !== 'AWG'){
      let option1 = document.createElement('option')
      option1.text = `${element}`
      if(element === SolenoidParameters.PERMEABILITY){
        option1.text = "Relative Permeability"
      }
      option1.value = `${element}`
      option1.id = `option-y-${element}`
      select_Y.add(option1)
    }
  })
}

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
  document.getElementById('step-input').value = '1'
  previousX = $('#x-values-input')[0].value;
  $(`#option-y-${previousX}`).hide();
  previousY = $('#y-values-input')[0].value;
  $(`#option-x-${previousY}`).hide();
  $('#x-value-range-label')[0].textContent = 'Voltage range';
  graphRange(0);
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

const addAwgSelectOptions = () =>{
    $('#dropdown-text-awg').append("<option>"+ '0000' + "</option>")
    $('#dropdown-text-awg').append("<option>"+ '000' + "</option>")
    $('#dropdown-text-awg').append("<option>"+ '00' + "</option>")
    for(let i = 0; i<41; i++){
        $("#dropdown-text-awg").append("<option>" + i + "</option>");
    }
};

const graphRange = x_value => {
  let ranges = [
    {'name' : 'Voltage', 'min': '0', 'max': '99', 'dMin': '1', 'dMax': '30', 'step': '1',},
    {'name' : 'Length', 'min': '0', 'max': '99', 'dMin': '10', 'dMax': '30', 'step':'1',},
    {'name' : 'r0', 'min': '0', 'max': '99', 'dMin': '2', 'dMax': '25', 'step': '0.1',},
    {'name' : 'ra', 'min': '0', 'max': '99', 'dMin': '3', 'dMax': '5', 'step': '0.1',},
    {'name' : 'x', 'min': '0', 'max': '99', 'dMin': '0', 'dMax': '10', 'step': '1',},
    {'name' : 'Force', 'min': '0', 'max': '99', 'dMin': '5', 'dMax': '20', 'step': '1',},
    {'name' : 'AWG', 'min': '0', 'max': '40', 'dMin': '26', 'dMax': '40', 'step': '1',},
    {'name' : 'relative_permeability', 'min': '0', 'max': '200000', 'dMin':'100', 'dMax': '10000', 'step': '100'},
  ]
  if(x_value === 4){ 
    ranges[4].max = $("#input-text-length")[0].value;
  }
  $("#slider-range").slider({
    range: true,
    min: ranges[x_value].min,
    max: ranges[x_value].max,
    step: findStep(x_value),
    values: [ranges[x_value].dMin , ranges[x_value].dMax],
    slide: function(event, ui) {//Maybe add a symbol to the range values so that it can say 7N, or 8 Volts - 20 Volts
      if(event.originalEvent){ $('#x-value-range').val(ui.values[0] + " - " + ui.values[1]); }
    },
  });
  $( "#x-value-range" ).val( $( "#slider-range" ).slider( "values", 0 ) + " - " + $( "#slider-range" ).slider( "values", 1 ) );
}

const findStep = x_value => {
  if(x_value === 2 || x_value === 3){
    return .1;
  }
  if(x_value === 7 ){
    return 100;
  }
  return 1;
}
const chartDownload = () => {
  let a = document.createElement('a');
  a.href = newChart.toBase64Image();
  a.download = 'chart.png';
  a.click()
}
const dropDownPermeability = () =>{
    let items = [
        { 'name': 'carbon steel', 'value': '100' },
        { 'name': 'nickel', 'value': '100' },
        { 'name': 'magnetic iron', 'value': '200' },
        { 'name': 'ferrite (magnesium manganese zinc)', 'value': '350' },
        { 'name': 'electrical steel', 'value': '4000' },
        { 'name': 'iron (99.8% pure)', 'value': '5000' },
        { 'name': 'permalloy (75% nickel, 21.5% iron)', 'value': '8000' },
        { 'name': 'mumetal (75% nickel, 2% chromium, 5% copper, 18% iron)', 'value': '200000' },
    ];

    items.forEach( item => {
        let option = document.createElement('option')
        option.text = item.name
        option.value = item.value
        $(`#dropdown-text-${SolenoidParameters.PERMEABILITY}`).append(option)
    })

}


(() => {

  $("select[name=x-values-input]").change(function() {
    $(`#option-y-${previousX}`).show()
    previousX = this.value;
    $("#x-value-range-label").text(`${previousX} range:`)
    graphRange($("select[name=x-values-input")[0].selectedIndex - 1)
    $(`#option-y-${previousX}`).hide()
  });

  $("select[name=y-values-input]").change(function() {
    $(`#option-x-${previousY}`).show()
    previousY = this.value;
    $(`#option-x-${previousY}`).hide()
  });   
})();


