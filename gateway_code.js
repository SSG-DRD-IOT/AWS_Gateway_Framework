//Sensor Readings

var mraa = require('mraa');
console.log(mraa.getVersion());
mraa.addSubplatform(mraa.GENERIC_FIRMATA, "/dev/ttyACM0");

var groveSensor = require('jsupm_grove');

var lcd = require('jsupm_i2clcd');

var display = new lcd.Jhd1313m1(512, 0x3E, 0x62);

var light = new groveSensor.GroveLight(512);

var stateUpdate = {
    "state": {
        "reported": {
            "Light_Value": 0
                    }
              }
            }

function SendLightSensorValue() {
    console.log(light.name() + " raw value is " + light.raw_value() +
            ", which is roughly " + light.value() + " lux");

            stateUpdate = {
                "state": {
                    "reported": {
                        "Light_Value": light.value()
                                }
                          }
                        }

              device.publish('$aws/things/webinar_gateway/sensors', JSON.stringify(stateUpdate))
}
setInterval(SendLightSensorValue, 1000);

//AWS Connection

var awsIot = require('aws-iot-device-sdk');

var device = awsIot.device({
   keyPath: "/home/nuc-user/aws_webinar/webinar_gateway.private.key",
  certPath: "/home/nuc-user/aws_webinar/webinar_gateway.cert.pem",
    caPath: "/home/nuc-user/aws_webinar/root-CA.crt",
  host:"a2la7zf3kffmrf.iot.us-west-2.amazonaws.com"
});

device.subscribe('$aws/things/webinar_gateway/input');

device
  .on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
    console.log('lcd message: ', JSON.parse(payload.toString()).state.desired.LCD)
    display.setCursor(0,0);
    lcd_message = JSON.parse(payload.toString()).state.desired.LCD
    display.write(lcd_message + '                 ')
  });



device
  .on('connect', function() {
    console.log('connect');
    });

  device
     .on('close', function() {
        console.log('close');
     });
  device
     .on('reconnect', function() {
        console.log('reconnect');
     });
  device
     .on('offline', function() {
        console.log('offline');
     });
  device
     .on('error', function(error) {
        console.log('error', error);
     });
