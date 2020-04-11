const { app, BrowserWindow , ipcMain } = require('electron')
const utils = require('./utils.js')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

let start_reading = function() {
  win.loadFile("src/index.html");
}

let resize = function() {
  setTimeout(function(){
    win.setSize(1000,200,true);
    win.resizable = true;
  },200);
}

let main_menu = function() {
  win.loadFile("src/start.html");
  setTimeout(function(){
    win.setSize(800,700,true);
    win.resizable = true;
  },700);
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

const dialog = require('electron').dialog;
const spawn = require("child_process").spawn;

ipcMain.on('open-file-dialog', async() => {
  
    //This operation is asynchronous and needs to be awaited
    const files = await dialog.showOpenDialog({
      // The Configuration object sets different properties on the Open File Dialog 
      properties: ['openFile'],
      filters: [{name: 'PDF files', extensions: ['pdf']}]
    });
  
    // If we don't have any files, return early from the function
    if (!files) {
        return;
    }
  
    // Pulls the first file out of the array
  
    //const file = files[0];
    // Reads from the file and converts the resulting buffer to a string
    //const content = fs.readFileSync(file).toString();
  
    // Log the Files to the Console
    const filePath = files.filePaths[0];
    var command = './src/frpy/bin/python3 ./src/test.py "' + filePath + '"';
    console.log(command);
    var pythonProcess = spawn('./src/frpy/bin/python3',["./src/test.py",filePath]);
    pythonProcess.stdout.on('data', (data) => {
      if (data.toString() == '0'){
        win.webContents.send("selected-file", utils.shrinkPath(filePath));
      }
      else {
        win.webContents.send("python-error", utils.shrinkPath(filePath));
      }
    });
})

ipcMain.on("start-reading", function(event){
    start_reading();
})

ipcMain.on('resize', function(event){
  resize();
})

ipcMain.on("main-menu", function(event){
  main_menu();
})