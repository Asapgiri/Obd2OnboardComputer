const path = require('path')
const settings = JSON.parse(require('fs').readFileSync(path.join(__dirname, 'settings.json'))).obd
const OBDReader = require('obd2-over-serial')

console.log(settings)
var serialOBDReader = new OBDReader(settings.port, settings.options);

serialOBDReader.on('dataReceived', function (data) {
  console.log(JSON.stringify(data));
});

serialOBDReader.on('connected', function (data) {
  console.log(data)
  settings.pollers.forEach(poller => {
    this.addPoller(poller)
    console.log('ADDED POLLER:', poller)
  })
  this.startPolling(settings.refreshInterval) //Polls all added pollers each x ms.
});

serialOBDReader.connect();

