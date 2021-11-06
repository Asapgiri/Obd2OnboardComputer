const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000
const args = process.argv.slice(2);
var portAudio = require('naudiodon');


//console.log(portAudio.getDevices());
var ai = new portAudio.AudioIO({
  inOptions: {
    channelCount: 2,
    sampleFormat: portAudio.SampleFormat16Bit,
    sampleRate: 44100,
    deviceId: -1, // Use -1 or omit the deviceId to select the default device
    closeOnError: true // Close the stream if an audio error is detected, if set false then just log the error
  }
});

const filesLocation = args[0] ? args[0] : './src/assets/music'

app.get('/api/mp', (req, res) => {
  const files = fs.readdirSync(filesLocation)
  console.log('Request:', req.ip, `[${files.length}]`)
  res.send(files)
})

/*app.get('/api/bt', (req, res) => {
  res.set("content-type", "audio/mpeg");
  res.set("accept-ranges", "bytes");
  //res.set("content-length", 44100);
  ai = new portAudio.AudioIO({
    inOptions: {
      channelCount: 2,
      sampleFormat: portAudio.SampleFormat16Bit,
      sampleRate: 44100,
      deviceId: -1, // Use -1 or omit the deviceId to select the default device
      closeOnError: true // Close the stream if an audio error is detected, if set false then just log the error
    }
  });

  //console.log('start')
  ai.on('data', (data) => {
    //console.log(data)
    res.write(data)
  })

  ai.start();
  // Wait a while as you record the audio in -- check your sound levels in SoundflowerBed, etc.
  // When you are done...
  //ai.quit();
})*/

let travelled = 0

app.get('/api/obd', (req, res) => {
  const response = {
    speed: Math.floor(Math.random()*200),
    gear: Math.floor(Math.random() * 6),
    rev: Math.floor(Math.random() * 6000),
    fuelCons: {
      long: Math.floor(Math.random() * 200),
      short: Math.floor(Math.random() * 200) / 10
    },
    travelled: travelled,
    drivingStyle: 'good',
    drivingTime: travelled
  }
  travelled += 1
  res.send(response)
})

app.get('/api/temp', (req, res) => {
  let response
  if (req.query.prec) response = { temp: parseFloat((Math.random() * 20).toFixed(req.query.prec)) }
  else response = { temp: Math.random() * 20 }
  res.send(response)
})

app.get('/api/gps', (req, res) => {
  const response = {
      lat: 47.7808951240949,
      lng: 18.8821291923523
  }
  res.send(response)
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
