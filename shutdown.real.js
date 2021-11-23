const { exec } = require("child_process");
const gpio = require('rpi-gpio'); //include onoff to interact with the GPIO
// import gpio from 'rpi-gpio'
const poweron_pin = 16
const acc_pin = 18
let intervalId, startedPowerOff = false

gpio.setup(poweron_pin, gpio.DIR_OUT, () => {
  gpio.write(poweron_pin, true)
})

gpio.setup(acc_pin, gpio.DIR_IN, () => {
  intervalId = setInterval(read, 100)
})

function read() {
  gpio.read(acc_pin, (err, value) => {
    if (!value && !startedPowerOff) {
      console.log('Power loss... Waiting 3/4 minute before shut off.')
      setTimeout(powerOff, 45000)
      startedPowerOff = true
    }
  })
}

function powerOff() {
  clearInterval(intervalId)
  // gpio.write(poweron_pin, false)
  exec('sudo shutdown -h now')
}
