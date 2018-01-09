const electron = require('electron');
const {app, BrowserWindow} = electron;

app.on('ready', function () {
  var index = new BrowserWindow({
    width: 1440,
    height: 900
  });
  index.loadURL('file://' + __dirname + '/index.html');
});
