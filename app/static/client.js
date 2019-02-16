var interpretation = {
  negative: "Yeah, it's sad",
  neutral:  "Hm, actually, it's hard to tell",
  positive: "No, I don't think it's sad"
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
    el('result-label').innerHTML = '...'
    xhr.onload = function(e) {
        if (this.readyState === 4) {
            var response = JSON.parse(e.target.responseText);
            prediction = `${response['result']}`;
            el('result-label').innerHTML = interpretation[prediction];
            if  (prediction == 'negative') document.body.className = 'sad'
            else document.body.className = ''
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

