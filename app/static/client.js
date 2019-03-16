var interpretation = {
  negative: "No, I don't think you are ;(",
  neutral:  "You don't look very sad, but it's still not a real smile :/",
  positive: "Yeah, it looks like you are :)"
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
            track_face();
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

function plot(x, y, w, h) {
  var container = el('image-picked');
  var img_canvas = el('image-picked').children[0];
  var rect = document.createElement('div');
  container.appendChild(rect);
  rect.classList.add('rect');
  rect.style.width = w + 'px';
  rect.style.height = h + 'px';
  rect.style.left = (img_canvas.offsetLeft + x) + 'px';
  rect.style.top = (img_canvas.offsetTop + y) + 'px';
};

function track_face() {
  var img_canvas = el('image-picked').children[0];
  var tracker = new tracking.ObjectTracker(['face']);
  tracker.setStepSize(1.7);
  tracker.on('track', function(event) {
    event.data.forEach(function(rect) {
      plot(rect.x, rect.y, rect.width, rect.height);
    });
  });
  tracking.track(img_canvas, tracker);
}
