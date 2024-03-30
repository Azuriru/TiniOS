const { app, BrowserWindow } = require('electron');

const path = require('path');
const index = path.join(__dirname, 'output', 'index.html');
const url = require('url');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        height: 800,
        width: 1200,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    mainWindow.maximize();
    mainWindow.loadURL(url.format({
        pathname: index,
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.webContents.openDevTools(); // cause, debugging.
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

/**
 * Electron has finished initialization and is ready to create
 * browser windows. Some APIs can only be used after this event occurs.
 */
app.on('ready', createWindow);

/**
 * Quit when all windows are closed.
 */
app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    /**
     * On OS X it's common to re-create a window in the app when the
     * dock icon is clicked and there are no other windows open.
     */
    if (mainWindow === null) {
        createWindow();
    }
});