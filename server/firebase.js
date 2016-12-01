var nconf = require('nconf');
var firebase = require("firebase");

nconf.argv().env().file('./config.json');

var firebaseConfig = {
    apiKey: nconf.get('firebaseApiKey'),
    databaseURL: nconf.get('firebaseDatabaseURL'),
};
firebase.initializeApp(firebaseConfig);