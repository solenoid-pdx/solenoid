// download file, pass in filename and text
const download = (filename, text) => {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  );
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// create a Json object contains data from user inputs
const saveParametersToJson = () => {
  // create a Json obj
  const inputs = [
    { name: SolenoidParameters.VOLTAGE, value: '', unit:''},
    { name: SolenoidParameters.LENGTH, value: '',unit:''},
    { name: SolenoidParameters.R0, value: '',unit:''},
    { name: SolenoidParameters.RA, value: '', unit:''},
    { name: SolenoidParameters.X, value: '', unit:''},
    { name: SolenoidParameters.FORCE, value: '',unit:''},
    { name: SolenoidParameters.AWG, value: '',unit:'' },
    { name: SolenoidParameters.PERMEABILITY, value: '',unit:'' },
  ];
  // loop through the inputs and assign value from user inputs
  inputs.forEach((input, _index) => {
    // element: each parameters
    const element = document.getElementById(`input-text-${input.name}`);
    const unit = document.getElementById(`input-unit-${input.name}`);
    if (element.value === '') {
      input.value = 0;
    } else input.value = element.value;
    // check if unit exits
    if(unit !== null) {
        input.unit = unit.value
    }
  });

  const myJSON = JSON.stringify(inputs);
  const text = myJSON;
  const filename = 'parameters.json';
  // Pass file name & text(Json obj) to download function
  download(filename, text);
};

// function allows upload a Json file to input data
const upload = (input) => {
  if (window.FileReader) {
    const file = input.files[0];
    const filename = file.name.split('.')[0];
    const reader = new FileReader();
    // get file contents
    reader.onload = function () {
      const text = this.result;
      const obj = JSON.parse(text);
      // get current URL
      const url = new URL(window.location);

      // loop through obj, take its value to consist a new URL
      obj.forEach((item) => {
       if (item.name === SolenoidParameters.LENGTH ||
        item.name === SolenoidParameters.R0 ||
        item.name === SolenoidParameters.RA ||
        item.name === SolenoidParameters.X
      ) {
         url.searchParams.delete(`${item.name}_unit`);
         url.searchParams.set(`${item.name}_unit`, item.unit);
       }
        url.searchParams.delete(item.name);
        url.searchParams.set(item.name, item.value);

      });

      window.history.pushState({}, document.title, url);
      // refresh page
      location.reload()
    };
    reader.readAsText(file);
  }
};

// function to copy text to Clipboard, pass in text that to be copied
const copyTextToClipboard = (text) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};

// pass in current url to copyTextToClipboard function
const copyLink = () => {
  copyTextToClipboard(location.href);
};
