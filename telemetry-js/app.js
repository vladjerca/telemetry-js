// general dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config');

// routes 
var home = require('./routes/index');
var telemetry = require('./routes/telemetry');
var apps = require('./routes/apps');
var appStats = require('./routes/appStats');
var error = require('./routes/error');
var token = require('./routes/token');

var app = express();

app.use(express.static('scripts'));
app.use(express.static('styles'));
app.use(express.static('views'));

var db = mongoose.connect(config.connectionString).connection;

db.on('error', function (err) { console.log(err.message); });

db.once('open', function () {
    console.log("mongodb connection open");
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', home);
app.use('/api/telemetry', token);
app.use('/api', telemetry);
app.use('/api', appStats);
app.use('/api', apps);

app.use(error);

var appPort = process.env.OPENSHIFT_NODEJS_PORT || 1337;
var appIp = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(appPort, appIp, function () {
    console.log("Listening on " + appIp + ":" + appPort);
});

process.on('uncaughtException', function (err) {
    console.log(err);
}); 
