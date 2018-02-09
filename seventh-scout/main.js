var electron = require('electron');
var app = electron.app;
var BrowserWindow = BrowserWindow = electron.BrowserWindow;
var fs = require('fs');

app.on('ready', function () {
	var mainWindow = new BrowserWindow({width:1000,height:800})
	mainWindow.loadURL('file://' + __dirname + '/index.html');
});