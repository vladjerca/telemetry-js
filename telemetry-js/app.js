/* --------------------- PACKAGES --------------------- */
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/app-configuration');
var logger = require('./logging/logger');

/* ------------------- IMPORT ROUTES ------------------ */
var home = require('./routes/index');
var telemetry = require('./routes/telemetry');
var applications = require('./routes/applications');
var applicationStatistics = require('./routes/applicationStatistics');
var error = require('./routes/error');
var token = require('./routes/token');

var app = express();

/* ----------------- STATIC RESOURCES ----------------- */
app.use(express.static('scripts'));
app.use(express.static('styles'));
app.use(express.static('views'));

/* --------------------- DATABASE --------------------- */
var db = mongoose.connect(config.connectionString, logger.logError).connection;
db.on('error', logger.logError);
db.once('open', function () {
    console.log("mongo connection established...");
});

/* ---------------------- HEADERS --------------------- */
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* ------------------- BODY PARSERS ------------------ -*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/* ---------------------- ROUTES ---------------------- */
app.use('/', home);
app.use('/api/telemetry', token);
app.use('/api', telemetry);
app.use('/api', applicationStatistics);
app.use('/api', applications);
app.use(error);

/* ----------------------- START ---------------------- */
app.listen(config.appPort, config.ipAddress, function () {
    console.log("Listening on " + config.ipAddress + ":" + config.appPort);
});

process.on('uncaughtException', logger.logError);
