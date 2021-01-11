const renderPage = () => {
    mountInputs();
};

const mountInputs = () => {
    let input_form = document.getElementById("input-submit-form");
    console.log(input_form);
    let inputs = createInputs();
    let submit_button = '<input class="btn btn-outline-primary" type="submit" value="Calculate">'
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
        { 'Symbol': 'V', 'unit': 'volts', 'InputElement': '' },
        { 'Symbol': 'L', 'unit': 'mm', 'InputElement': '' },
        { 'Symbol': 'N', 'unit': 'turns', 'InputElement': '' },
        { 'Symbol': alpha, 'unit': 'units', 'InputElement': '' },
        { 'Symbol': gamma, 'unit': 'units', 'InputElement': '' },
        { 'Symbol': 'r sub not', 'unit': 'mm', 'InputElement': '' },
        { 'Symbol': 'r sub a', 'unit': 'mm', 'InputElement': '' },
        { 'Symbol': 'x', 'unit': 'units', 'InputElement': '' },
        { 'Symbol': 'F', 'unit': 'N', 'InputElement': '' },
    ];
    inputs.forEach( (element,index) => {
        // console.log(element, index+1);
        element['InputElement'] = 
        `<div id="input-${index}" class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text">${formatR(element['Symbol'])}</span>
          <div class="input-group-text">
            <input type="radio" aria-label="Radio button for following text input" name="radAnswer">
          </div>
        </div>
        <input type="text"
               id="input-text-${index}"
               class="form-control"
               aria-label="Text input with radio button"
               placeholder="Enter ${element['Symbol']}"
         >
        <div class="input-group-append">
            <span class="input-group-text">${element['unit']}</span>
          </div>
        </div>
      `
    });
    return inputs;
};

const formatR = unit => {
  if (unit == 'r sub not')
    return 'r<sub>0</sub>';
  if (unit == 'r sub a')
    return 'r<sub>a</sub>';
  return unit;
}

const updateTracevalue = () => {
  let range = $('#graph-trace-slider');
  let display = $('#graph-trace-value');
  console.log(range.value);
  display.innerHTML = range.value;
};