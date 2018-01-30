const electron = require('electron');
const {app, BrowserWindow} = electron;

app.on('ready', function () {
  var index = new BrowserWindow({
    width: 1200,
    height: 900
  }).loadURL('file://' + __dirname + '/index.html');
});
