console.log('Loading function');
var ENDPOINT = 'a2la7zf3kffmrf.iot.us-west-2.amazonaws.com'

var AWS = require("aws-sdk");
var iotData = new AWS.IotData({endpoint: ENDPOINT, region: 'us-west-2'});
var stateUpdate = {
    "state": {
        "desired": {
            "LCD": "Nominal"
        }
    }
}

    // Set up the code to call when the Lambda function is invoked
    exports.handler = (event, context, callback) => {

      var Light_Value = event.state.reported.Light_Value

      if (Light_Value > 10){
          stateUpdate.state.desired.LCD = "Danger: Too Bright!"
      }

      if (Light_Value < 10){
          stateUpdate.state.desired.LCD = "Nominal"
      }

      var params = {
        topic: '$aws/things/webinar_gateway/input',
        payload: JSON.stringify(stateUpdate),
        qos: 0
      };

        console.log(params)

      iotData.publish(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });

    };
