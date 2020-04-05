const {ipcRenderer} = require('electron');

function chooseFile(){
    ipcRenderer.send('open-file-dialog');
}

function startReading(){
    var elem = document.getElementById("mainContainer");
    elem.style.animationFillMode = "forwards";
    animateCSS(elem,
    "slideOutUp",
    function(){
        elem.style.display = "none";
        ipcRenderer.send('start-reading');
    });
}

function animateCSS(element, animationName, callback) {
    const node = element
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)
        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

//Getting back the information after selecting the file
ipcRenderer.on('selected-file', function (event, path) {
    
    var startReading = document.getElementById('startReading');
    startReading.style.animationDuration = "1000ms";
    // do what you want with the path/file selected, for example:
    if (new String(path).valueOf() != new String("...undefined").valueOf()){
        document.getElementById('chFileLabel').textContent = `You've selected: ${path}`;
        startReading.style.display = "block";
    }
    else{
        document.getElementById('chFileLabel').textContent = "Nothing Selected";
        startReading.style.display = "none";
    }
});
