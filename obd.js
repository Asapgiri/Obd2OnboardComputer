const settings = JSON.parse(require('fs').readFileSync('settings.json')).obd
const OBDReader = require('obd2-over-serial')

console.log(settings)
var serialOBDReader = new OBDReader(settings.port, settings.options);

serialOBDReader.on('dataReceived', function (data) {
  console.log(data);
});

serialOBDReader.on('connected', function (data) {
  console.log(data)
  for (const poller in settings.pollers)
    self.obd.addPoller(poller)

  self.obd.startPolling(self.globalSettings.obd.refreshInterval) //Polls all added pollers each x ms.
});

serialOBDReader.connect();

