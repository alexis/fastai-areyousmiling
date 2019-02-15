var el = x => document.getElementById(x);
var scaled_image;

function showPicker(inputId) { 
  el('file-input').click(); 
}

function showPicked(input) {
    el('upload-label').innerHTML = input.files[0].name;

    loadImage(
        input.files[0],
        function (canvas) {
            el('image-picked').src = canvas.toDataURL()
            el('image-picked').className = '';
            scaled_image = canvas
        },
        {maxWidth: 400, canvas: true}
    );
}

function analyze() {
    var uploadFiles = el('file-input').files;
    if (uploadFiles.length != 1) alert('Please select 1 file to analyze!');

    el('analyze-button').innerHTML = 'Uploading...';
    el('result-label').innerHTML = '';
    var xhr = new XMLHttpRequest();
    var loc = window.location
    xhr.open('POST', `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`, true);
    xhr.onerror = function() {alert (xhr.responseText);}
    xhr.onload = function(e) {
        if (this.readyState === 4) {
            var response = JSON.parse(e.target.responseText);
            el('result-label').innerHTML = `${response['result']}`;
        }
        el('analyze-button').innerHTML = 'Analyze';
    }

    var fileData = new FormData();

    if (scaled_image.toBlob) {
        scaled_image.toBlob(
            function (blob) {
                var fileData = new FormData();
                //fileData.append('file', blob, fileName);
                fileData.append('file', blob);
                xhr.send(fileData);
            },
            'image/jpeg'
        );
    }
}

