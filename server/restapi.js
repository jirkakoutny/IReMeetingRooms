// nconf
var nconf = require('nconf');
nconf.argv().env().file('./config.json');

// IoTHubClient
var IoTHubClient = require('./iothub.js');

// Actions resolver
var actionsResolver = require('./actionsResolver.js');

// express
var express = require('express')
var bodyParser = require('body-parser');

var app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/get', function (req, res) {
    res.json({ message: 'Hello World!' })
})

app.post('/api/command', function (req, res) {
    var targetDevice = nconf.get('targetDevice'); 
    var action = req.body.action;
    var actor = req.body.actor;
    var parameters = actionsResolver.resolveParametersFor(action, actor);
    IoTHubClient.sendC2DCommand(targetDevice, action, actor, parameters);
    res.json({ message: 'Got a POST request' })
})

app.listen(3001)
console.log('RestAPI listening on port 3001');
