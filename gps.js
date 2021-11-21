const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyACM0');
const parser = new Readline();
port.pipe(parser);

const { exec } = require("child_process");

const GPS = require('gps');
const gps = new GPS;
let firstTime = true;


gps.on('data', function(data) {
  if (firstTime) {
    firstTime = false;
    exec(`sudo date -s "${data.time}"`);
  }
  if (data.time)
    console.log(JSON.stringify(data))//, gps.state);
});

port.on('data', function(data) {
  gps.updatePartial(data);
  port.resume();
});
