//import { awg_table } from "table.js";

const renderPage = () => {
    mountInputs();
};

const mountInputs = () => {
    let input_form = document.getElementById("input-submit-form");
    let inputs = createInputs();
    let submit_button = '<input class="btn btn-primary" type="submit" value="Calculate">'
    inputs.forEach(input => {
        // console.log(input);
        input_form.insertAdjacentHTML('beforeend', input['InputElement']);
    });
    input_form.insertAdjacentHTML('beforeend', submit_button);
};

const createInputs = () => {
    let alpha = '\u03B1';
    let gamma = '\u03B3';
    let inputs = [
        { 'Symbol': 'V', 'Unit': 'volts', 'InputElement': '' },
        { 'Symbol': 'L', 'Unit': 'mm', 'InputElement': '' },
        { 'Symbol': 'N', 'Unit': 'turns', 'InputElement': '' },
        { 'Symbol': alpha, 'Unit': 'units', 'InputElement': '' },
        { 'Symbol': gamma, 'Unit': 'units', 'InputElement': '' },
        { 'Symbol': 'r sub not', 'Unit': 'mm', 'InputElement': '' },
        { 'Symbol': 'r sub a', 'Unit': 'mm', 'InputElement': '' },
        { 'Symbol': 'x', 'Unit': 'units', 'InputElement': '' },
        { 'Symbol': 'F', 'Unit': 'N', 'InputElement': '' },
    ];
    inputs.forEach( (element,index) => {
        // console.log(element, index+1);
        element['InputElement'] = 
        `<div id="input-${index}" class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text">${checkInput(element['Symbol'])}</span>
          <div class="input-group-text">
            <input type="radio" aria-label="Radio button for following text input" name="radAnswer">
          </div>
        </div>
        <input type="text"
               class="form-control"
               aria-label="Text input with radio button"
               placeholder="Enter ${element['Symbol']}"
         >
        <div class="input-group-append">
            <span class="input-group-text">${element['Unit']}</span>
          </div>
        </div>
      `
    });
    return inputs;
};

const checkInput = unit => {
  if (unit == 'r sub not')
    return 'r<sub>0</sub>';
  if (unit == 'r sub a')
    return 'r<sub>a</sub>';
  return unit;
}

const displayInputs = () => {
};

const updateTraceValue = () => {
  let range = document.getElementById('graph-trace-slider');
  let display = document.getElementById('graph-trace-value');
  console.log(range.value);
  display.innerHTML = range.value;
};