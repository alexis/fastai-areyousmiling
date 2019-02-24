var interpretation = {
  negative: "No, I don't think you are. Actually, it's more like you're sad ;(",
  neutral:  "You don't look very sad, but it's still not a smile :/",
  positive: "It looks like you are! And I like your smile :)"
}

var el = x => document.getElementById(x);

function showPicker(inputId) { 
  el('file-input').click(); 
}

function showPicked(input) {
    el('upload-label').innerHTML = input.files[0].name;

    loadImage(
        input.files[0],
        function (canvas) {
            el('image-picked').className = '';
            el('image-picked').innerHTML = '';
            el('image-picked').appendChild(canvas);
            el('choose-file-button').className = 'no-display';
            document.body.className = '';

            analyze();
        },
        {maxWidth: 400, maxHeight: 400, orientation: true, canvas: true}
    );
}

function analyze() {
    var canvas = el('image-picked').children[0]

    el('result-label').innerHTML = '';
    var xhr = new XMLHttpRequest();
    var loc = window.location
    xhr.open('POST', `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`, true);
    xhr.onerror = function() {alert (xhr.responseText);}
    el('result-label').innerHTML = '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'
    xhr.onload = function(e) {
        if (this.readyState === 4) {
            var response = JSON.parse(e.target.responseText);
            prediction = `${response['result']}`;
            el('result-label').innerHTML = interpretation[prediction];
            el('choose-file-button').className = '';
            document.body.className = prediction;
        }
    }

    var fileData = new FormData();


    if (canvas.toBlob) {
        canvas.toBlob(
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

