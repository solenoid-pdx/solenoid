
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function savingData(){
    let inputs = [
          { 'name': 'voltage', 'value': '' },
          { 'name': 'length', 'value': '' },
          { 'name': 'r_not', 'value': '' },
          { 'name': 'r_a', 'value': '' },
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

    var myJSON = JSON.stringify(inputs);
    text = myJSON;
    var filename = "input.json";
    download(filename, text);
}



function upload(input) {
    if (window.FileReader) {
        var file = input.files[0];
        filename = file.name.split(".")[0];
        var reader = new FileReader();
        reader.onload = function() {
            //console.log(this.result)

            text = this.result;
            console.log(text)
            var obj = JSON.parse(text);
            console.log(obj)


        obj.forEach(item => {
        document.getElementById(`input-text-${item.name}`).value = item.value
        });
        }
        reader.readAsText(file);
    }
}