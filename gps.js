const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/serial0');
const parser = new Readline();
port.pipe(parser);

const GPS = require('gps');
const gps = new GPS;

gps.on('data', function(data) {
  if (data.time)
    console.log(JSON.stringify(data))//, gps.state);
});

port.on('data', function(data) {
  gps.updatePartial(data);
});
