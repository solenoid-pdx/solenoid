const download = (filename, text) => {
  let element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  );
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const savingData = () => {
  let inputs = [
    { name: SolenoidParameters.VOLTAGE, value: '', unit:''},
    { name: SolenoidParameters.LENGTH, value: '',unit:''},
    { name: SolenoidParameters.R0, value: '',unit:''},
    { name: SolenoidParameters.RA, value: '', unit:''},
    { name: SolenoidParameters.X, value: '', unit:''},
    { name: SolenoidParameters.FORCE, value: '',unit:''},
    { name: SolenoidParameters.AWG, value: '',unit:'' },
    { name: SolenoidParameters.PERMEABILITY, value: '',unit:'' },
  ];

  inputs.forEach((input, _index) => {
    let element = document.getElementById(`input-text-${input.name}`);
    let unit = document.getElementById(`input-unit-${input.name}`);
    if (element.value === '') {
      input.value = 0;
    } else input.value = element.value;

    if(input.name !== SolenoidParameters.VOLTAGE && input.name !== SolenoidParameters.AWG && input.name !== SolenoidParameters.PERMEABILITY) {
        input.unit = unit.value
    }
  });

  let myJSON = JSON.stringify(inputs);
  let text = myJSON;
  let filename = 'parameters.json';
  download(filename, text);
};

const upload = (input) => {
  if (window.FileReader) {
    let file = input.files[0];
    let filename = file.name.split('.')[0];
    let reader = new FileReader();
    reader.onload = function () {
      let text = this.result;
      let obj = JSON.parse(text);

      let url = new URL(window.location);
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
      location.reload()
    };
    reader.readAsText(file);
  }
};

const copyTextToClipboard = (text) => {
  let textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};

const copyLink = () => {
  copyTextToClipboard(location.href);
};
