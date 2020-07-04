/** @module main */

const { app, BrowserWindow, ipcMain } = require('electron')
const utils = require('./utils.js')
const dialog = require('electron').dialog
const spawn = require('child_process').spawn
const fs = require('fs')

/**
 * Keep a global reference of the window object, if you don't, the window will
 * be closed automatically when the JavaScript object is garbage collected.
 * @global
*/
let win

/**
 * Called when starting reader, after receiving 'start-reading' signal from ipcRender
 * @event start-reading
 * @see src/index.html
 */
const startReading = function () {
  win.loadFile('src/index.html')
}

/**
 * Called when resizing the Window win, after receiving 'resize' signal from ipcRender
 * @see win
 * @event resize
 */
const resize = function () {
  setTimeout(function () {
    win.setSize(1200, 200, true)
    win.resizable = true
  }, 200)
}

/**
 * Called when returning to the main menu, after receiving 'main-menu' signal from ipcRender
 * @event main-menu
 */
const mainMenu = function () {
  win.loadFile('src/start.html')
  setTimeout(function () {
    win.setSize(1000, 700, true)
    win.resizable = true
  }, 700)
}

/**
 * Creates the Window and sets its listeners
 * @see win
 */
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    },
    resizable: true
  })

  // and load the index.html of the app.
  win.loadFile('src/start.html')

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  // win.setMenu(null);

  fs.stat('./src/frpy/bin/python3', function (err, stat) {
    if (err == null) {
    } else if (err.code === 'ENOENT') {
      // file does not exist
      setTimeout(function () {
        spawn('python3', ['-m', 'venv', './src/frpy']).on('close', (code) => {
          spawn('./src/frpy/bin/pip3', ['install', '-r', './src/requirements.txt'])
        })
      }, 50)
    } else {
      console.log('Some other error: ', err.code)
    }
  })
}

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 * @event ready
 */
app.on('ready', createWindow)

/**
 * Quit when all windows are closed.
 * @event window-all-closed
 */
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * @event activate
 */
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

/**
 * @event open-file-dialog
 * @fires selected-file
 * @fires python-error
 */
ipcMain.on('open-file-dialog', async () => {
  // This operation is asynchronous and needs to be awaited
  const files = await dialog.showOpenDialog({
    // The Configuration object sets different properties on the Open File Dialog
    properties: ['openFile'],
    filters: [{ name: 'PDF files', extensions: ['pdf'] },
      { name: 'Text-based files', extensions: ['txt', 'md', 'log'] }]
  })

  // If we don't have any files, return early from the function
  if (!files) {
    return
  }

  // Pulls the first file out of the array
  const filePath = files.filePaths[0]

  // Calls the python process responsible for reading
  // the pdf file and converting it into an array of words
  var pythonProcess = spawn('./src/frpy/bin/python3', ['./src/parser.py', filePath])

  // Receives the exit code from the python process
  // 0 if it's everything OK, other value if an ERROR occurred
  pythonProcess.stdout.on('data', (data) => {
    // If no ERROR occurred, a signal is sent to the ipcRender with the filePath to be presented
    if (data.toString() === '0') {
      win.webContents.send('selected-file', utils.shrinkPath(filePath))
    } else {
      win.webContents.send('python-error', utils.shrinkPath(filePath))
    }
  })
})

/**
 * @event start-reading
 */
ipcMain.on('start-reading', function (event) {
  startReading()
})

/**
 * @event resize
 */
ipcMain.on('resize', function (event) {
  resize()
})

/**
 * @event main-menu
 */
ipcMain.on('main-menu', function (event) {
  mainMenu()
})
