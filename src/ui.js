/** @module ui */

const { ipcRenderer } = require('electron')

/**
 * Animates the @param element with an @param animationName
 * type of animation, and then executes @param callback
 * @param {document.element} element The element to be animated
 * @param {string} animationName The type of animation to be added
 * @param {function} callback The callback function to be executed after
 */
function animateCSS (element, animationName, callback) {
  const node = element
  node.classList.add('animated', animationName)

  function handleAnimationEnd () {
    node.classList.remove('animated', animationName)
    node.removeEventListener('animationend', handleAnimationEnd)
    if (typeof callback === 'function') { callback() }
  }

  node.addEventListener('animationend', handleAnimationEnd)
}

/**
 * Called when clicked the button to open file dialog,
 * sending a signal to ipcMain to open the file dialog
 * @fires open-file-dialog
 */
// eslint-disable-next-line no-unused-vars
function chooseFile () {
  ipcRenderer.send('open-file-dialog')
}

/**
 * Called when clicked the button to start the reader
 * @fires start-reading
 */
function startReading () {
  var elem = document.getElementById('mainContainer')
  elem.style.animationFillMode = 'forwards'
  animateCSS(elem,
    'slideOutUp',
    function () {
      elem.style.display = 'none'
      ipcRenderer.send('start-reading')
    })
}

/**
 * Getting back the information after selecting the file
 * @event selected-file
 */
ipcRenderer.on('selected-file', function (event, path) {
  var startReading = document.getElementById('startReading')
  startReading.style.animationDuration = '1000ms'
  // do what you want with the path/file selected, for example:
  if (new String(path).valueOf() !== new String('...undefined').valueOf()) {
    document.getElementById('chFileLabel').textContent = `You've selected: ${path}`
    startReading.style.display = 'block'
  } else {
    document.getElementById('chFileLabel').textContent = 'Nothing Selected'
    startReading.style.display = 'none'
  }
})

/**
 * If an error occurred when parsing the pdf file
 * @event python-error
 */
ipcRenderer.on('python-error', function (event, path) {
  document.getElementById('chFileLabel').textContent = 'An error occurred. Please, try again.'
  startReading.style.display = 'none'
})
