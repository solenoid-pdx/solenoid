const renderPage = () => {
    mountInputs();
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
    let alpha = '\u03B1';
    let gamma = '\u03B3';
    let inputs = [
        { 'name': 'voltage', 'symbol': 'V', 'unit': 'volts', 'html': '' },
        { 'name': 'length', 'symbol': 'L', 'unit': 'mm', 'html': '' },
        { 'name': 'turns', 'symbol': 'N', 'unit': 'turns', 'html': '' },
        { 'name': 'alpha', 'symbol': alpha, 'unit': 'units', 'html': '' },
        { 'name': 'gamma', 'symbol': gamma, 'unit': 'units', 'html': '' },
        { 'name': 'r_not', 'symbol': 'r sub not', 'unit': 'mm', 'html': '' },
        { 'name': 'r_a', 'symbol': 'r sub a', 'unit': 'mm', 'html': '' },
        { 'name': 'x', 'symbol': 'x', 'unit': 'mm', 'html': '' },
        { 'name': 'force', 'symbol': 'F', 'unit': 'N', 'html': '' },
        { 'name': 'awg', 'symbol': 'AWG', 'unit': 'guage', 'html': '' },
    ];
    inputs.forEach( element => {
        // console.log(html, index+1);
        element.html = 
        `<div id="input-${element.name}" class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text">${formatR(element.symbol)}</span>
          <div class="input-group-text">
            <input type="radio" aria-label="Radio button for following text input" name="radAnswer">
          </div>
        </div>
        <input type="text"
               id="input-text-${element.name}"
               class="form-control"
               aria-label="Text input with radio button"
               placeholder="Enter ${element.symbol}"
         >
        <div class="input-group-append">
            <span class="input-group-text">${element.unit}</span>
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