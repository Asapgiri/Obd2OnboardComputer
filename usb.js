var usbDetect = require('usb-detection');

usbDetect.startMonitoring();

usbDetect.on('change', function(device) { console.log('change0', device); });