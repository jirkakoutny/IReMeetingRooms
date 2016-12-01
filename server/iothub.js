var nconf = require('nconf');
var iotHub = require('azure-event-hubs').Client;

nconf.argv().env().file('./config.json');

var iotHubConnString = nconf.get('iotHubConnString');
var iotHubClient = iotHub.fromConnectionString(iotHubConnString);

iotHubClient.open()
    .then(iotHubClient.getPartitionIds.bind(iotHubClient))
    .then(function (partitionIds) {
        return partitionIds.map(function (partitionId) {
            return iotHubClient.createReceiver('$Default', partitionId, { 'startAfterTime': Date.now() }).then(function (receiver) {
                console.log('Created partition receiver: ' + partitionId)
                receiver.on('errorReceived', printError);
                receiver.on('message', printMessage);
            });
        });
    })
    .catch(printError);

function persistMessage(message) {
    // deviceMessagesNode.push(message);
    deviceMessagesNode.set(message);
};

// Other methods

// Print error
var printError = function (err) {
    console.log(err.message);
};

// Print message
var printMessage = function (message) {
    console.log('Message received: ');
    console.log(JSON.stringify(message.body));
    persistMessage(message.body)
    console.log('');
};
