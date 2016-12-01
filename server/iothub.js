// nconf
var nconf = require('nconf');
nconf.argv().env().file('./config.json');

// IoT Hub
var iotHubD2C = require('azure-event-hubs').Client;
var iotHubC2D = require('azure-iothub').Client;
var iotHubMsg = require('azure-iot-common').Message;

var iotHubConnString = nconf.get('iotHubConnString');

var iotHubD2CClient = iotHubD2C.fromConnectionString(iotHubConnString);
var iotHubC2DClient = iotHubC2D.fromConnectionString(iotHubConnString);

// Firebase
var firebase = require("firebase");
var firebaseConfig = {
    apiKey: nconf.get('firebaseApiKey'),
    databaseURL: nconf.get('firebaseDatabaseURL'),
};
firebase.initializeApp(firebaseConfig);

// IoTHubD2CPersistor
iotHubD2CClient.open()
    .then(iotHubD2CClient.getPartitionIds.bind(iotHubD2CClient))
    .then(function (partitionIds) {
        return partitionIds.map(function (partitionId) {
            return iotHubD2CClient.createReceiver('$Default', partitionId, { 'startAfterTime': Date.now() }).then(function (receiver) {
                console.log('Created partition receiver: ' + partitionId)
                receiver.on('errorReceived', handleD2cError);
                receiver.on('message', handleD2CMessage);
            });
        });
    })
    .catch(handleD2cError);

var handleD2cError = function (err) {
    console.log(err.message);
};
var handleD2CMessage = function (message) {
    console.log('Message received: ');
    console.log(JSON.stringify(message.body));
    persistMessage(message.body)
    console.log('');
};

function persistMessage(message) {
    // deviceMessagesNode.push(message);
    var deviceMessagesNode = firebase.database().ref(nconf.get('firebaseTargetPath'));
    deviceMessagesNode.set(message);
};

// IoTHubC2DCommenader
function sendC2DCommand(targetDevice) {
    iotHubC2DClient.open(function (err) {
        if (err) {
            console.error('Could not connect: ' + err.message);
        } else {
            console.log('Service client connected');
            iotHubC2DClient.getFeedbackReceiver(handleC2DFeedback);
            var message = new iotHubMsg('Cloud to device message.');
            message.ack = 'full';
            message.messageId = "My Message ID";
            console.log('Sending message: ' + message.getData());
            iotHubC2DClient.send(targetDevice, message, handleC2DResult('send'));
        }
    });
}

function handleC2DResult(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}

function handleC2DFeedback(err, receiver) {
    receiver.on('message', function (msg) {
        console.log('Feedback message:')
        console.log(msg.getData().toString('utf-8'));
    });
}



