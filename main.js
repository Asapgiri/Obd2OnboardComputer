// Modules to control application life and create native browser window
const { app, BrowserWindow, nativeTheme } = require('electron')
const { spawn } = require('child_process')
// const electronReload = require('electron-reload')
// electronReload(__dirname, {})

let server_process, indexHtml = 'dist/OBD2OnboardComputer/browser/index.html'
app.allowRendererProcessReuse = false

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      width: 1500,
      height: 500,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        backgroundThrottling: false,
        enableRemoteModule: true,
        contextIsolation: false
      },
      autoHideMenuBar: true,
      fullscreen: process.platform != 'win32'
    })

    // and load the index.html of the app.
    // mainWindow.loadFile(`dist/${__dirname.split(path.sep).pop()}/index.html`)
  mainWindow.loadFile(indexHtml)
    // mainWindow.loadFile(`dist/${__dirname.split(path.sep).pop()}/browser/index.html`)
    // mainWindow.loadFile('src/index.html')

    // Open the DevTools.
  mainWindow.webContents.openDevTools()
  mainWindow.webContents.on('did-fail-load', () => {
    console.log('did-fail-load');
    mainWindow.loadFile(indexHtml);
    // REDIRECT TO FIRST WEBPAGE AGAIN
  });


  nativeTheme.themeSource = 'dark'

  //spawnServer()
}

function spawnServer() {
  if (!server_process) {
    /*cd = spawn('cd', ['./'])
    cd.stdout.setEncoding('utf8')
    cd.stdout.on('data', data => console.log(data))*/

    server_process = spawn('node', ['./server.js', './dist/OBD2OnboardComputer/browser/assets/music'])
    server_process.stdout.setEncoding('utf8')
    server_process.stdout.on('data', data => {
      console.log(data)
    })
    server_process.on('error', error => {
      console.log(error)
    })


  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

    app.on('activate', function() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    if (server_process) server_process.kill()
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
