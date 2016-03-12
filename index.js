(function () {
    var video = document.querySelector('.camera__video'),
        canvas = document.querySelector('.camera__canvas'),
        context = canvas.getContext('2d');
        
    var getVideoStream = function (callback) {
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true},
                function (stream) {
                    video.src = window.URL.createObjectURL(stream);
                    video.onloadedmetadata = function (e) {
                        video.play();

                        callback();
                    };
                },
                function (err) {
                    console.log("The following error occured: " + err.name);
                }
            );
        } else {
            console.log("getUserMedia not supported");
        }
    };

    var applyFilter = function () {
        var pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        var filterName = document.querySelector('.controls__filter').value;
        var filters = {
            invert: function (r,g,b) {
                for (var i = 0; i < pixels.data.length; i = i + 4){
                    pixels.data[i] = 255 - pixels.data[i];
                    pixels.data[i + 1] = 255 - pixels.data[i + 1];
                    pixels.data[i + 2] = 255 - pixels.data[i + 2];
                }
            },
            grayscale: function (r,g,b) {
                for (var i = 0; i < pixels.data.length; i = i + 4){
                    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = pixels.data[i ] * 0.2126 + pixels.data[i + 1] * .7152 + pixels.data[i + 2] * 0.0722;
                }
            },
            threshold: function (r,g,b) {
                for (var i = 0; i < pixels.data.length; i = i + 4){
                    var color = (0.2126 * pixels.data[i] + 0.7152 * pixels.data[i + 1] + 0.0722 * pixels.data[i + 2] >= 128) ? 255 : 0;
                    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = color;
                }
            }
        };
        filters[filterName]();
        context.putImageData(pixels, 0, 0);
    };

    var captureFrame = function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        context.drawImage(video, 0, 0);
        applyFilter();
    };

    getVideoStream(function () {
        captureFrame();

        setInterval(captureFrame, 16);
    });
})();
