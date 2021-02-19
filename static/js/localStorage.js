const download = (filename, text) => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

const savingData = () => {
    let inputs = [
          { 'name': 'voltage', 'value': '' },
          { 'name': 'length', 'value': '' },
          { 'name': 'r0', 'value': '' },
          { 'name': 'ra', 'value': '' },
          { 'name': 'x', 'value': '' },
          { 'name': 'force', 'value': '' },
          { 'name': 'awg', 'value': '' },
        ];

    inputs.forEach( (input, _index) => {
        let element = document.getElementById(`input-text-${input.name}`);
        if(element.value === '' ) {
            input.value = 0;
        }
        else input.value = element.value;

    });

    let myJSON = JSON.stringify(inputs);
    let text = myJSON;
    let filename = "parameters.json";
    download(filename, text);
}

const upload = (input) => {
    if (window.FileReader) {
        let file = input.files[0];
        let filename = file.name.split(".")[0];
        let reader = new FileReader();
        reader.onload = function() {
            let text = this.result;
            let obj = JSON.parse(text);

        obj.forEach(item => {
        document.getElementById(`input-text-${item.name}`).value = item.value
        });
        }
        reader.readAsText(file);
    }
}

const copyTextToClipboard = text => {
  let textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}

const copyLink = () => {
  copyTextToClipboard(location.href);
}

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})