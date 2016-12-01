var express = require('express')
var bodyParser = require('body-parser');

var app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/get', function (req, res) {
    res.json({ message: 'Hello World!' })
})

app.post('/api/post', function (req, res) {
    var token = req.body.token;
    console.log(req.headers);
    console.log(req.body);
    console.log(req.body.token);

    res.json({ message: 'Got a POST request', token: token })
})

app.listen(3001)