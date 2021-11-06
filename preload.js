const { contextBridge, ipcRenderer, nativeTheme } = require('electron')
const fs = require('fs')

nativeTheme.themeSource = 'dark'

contextBridge.exposeInMainWorld(
  'media',
  {
    getMusic (string) {
      return fs.readdirSync(string)
    }
  }
)

