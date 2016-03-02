var telemetryDb = require('../models/telemetry');
var express = require('express');
var router = express.Router();

function aggregationOptionsByField(appName, eventType, fieldName, limit){
    limit = parseInt(limit) || 0;

    var options = [
        {
            $match: {
                applicationName: appName, 
                eventType: eventType
            }
        },
        {
            $group: {
                _id: "$eventData." + fieldName, 
                data: { $sum: 1 }
            }
        },
        { $sort: { data: -1 } }
    ];

    if (limit > 0)
        options.push({ $limit: limit })

    return options;
}

router.route('/app-stats/:appName/:eventType')
// GET ALL ENTRIES
.get(function (req, res) {
    var appName = req.params.appName,
		eventType = req.params.eventType;
    telemetryDb.count({
        applicationName: appName, 
        eventType: eventType
    }, function (err, count) {
        if (err)
            return res.send(err);
        
        res.json({
            application: appName,
            eventType: eventType,
            eventCount: count
        });
    });
});

router.route('/app-stats/:appName/:eventType/by-month/')
.get(function (req, res) {
    var appName = req.params.appName,
        eventType = req.params.eventType;
    
    telemetryDb.aggregate([
        {
            $match: {
                applicationName: appName, 
                eventType: eventType
            }
        },
        {
            $project: {
                year: { $year: "$date" },
                month: { $month: "$date" }
            }
        },
        {
            $group: {
                _id: { year: "$year", month: "$month" }, 
                data: { $sum: 1 }
            }
        },
        { $sort: { data: -1 } }
    ],
        function (err, result) {
        if (err)
            return res.json(err);

        var labelArray = [],
            dataArray = [];
        
        for (var i = 0, len = result.length; i < len; i++) {
            labelArray[i] = result[i]._id.year + '/' + result[i]._id.month;
            dataArray[i] = result[i].data
        }
        
        res.json({
            labelArray: labelArray,
            dataArray: dataArray
        });
    });
});

router.route('/app-stats/:appName/:eventType/:field/')
.get(function (req, res) {
	var appName = req.params.appName,
		eventType = req.params.eventType,
        fieldName = req.params.field;

    telemetryDb.aggregate(aggregationOptionsByField(appName, eventType, fieldName), 
        function (err, result) {
            if (err)
                return res.json(err);
        
            var labelArray = [],
                dataArray = [];

            for (var i = 0, len = result.length; i < len; i++) {
                labelArray[i] = result[i]._id;
                dataArray[i] = result[i].data
            }
        
            res.json({
                labelArray: labelArray,
                dataArray: dataArray
            });
    });
});

router.route('/app-stats/:appName/:eventType/:field/:count')
.get(function (req, res) {
    var appName = req.params.appName,
        eventType = req.params.eventType,
        fieldName = req.params.field,
        count = req.params.count;

    telemetryDb.aggregate(aggregationOptionsByField(appName, eventType, fieldName, count), 
        function (err, result) {
            if (err)
                return res.json(err);

            var labelArray = [],
                dataArray = [];

            for (var i = 0, len = result.length; i < len; i++) {
                labelArray[i] = result[i]._id;
                dataArray[i] = result[i].data
            }
        
            res.json({
                labelArray: labelArray,
                dataArray: dataArray
            });
    });
});

router.route('/app-stats/:appName/:eventType/:field/top/:count')
.get(function (req, res) {
    var appName = req.params.appName,
        eventType = req.params.eventType,
        fieldName = req.params.field,
        count = parseInt(req.params.count) || 0;

    telemetryDb.aggregate([
        {
            $match: {
                applicationName: appName, 
                eventType: eventType
            }
        },
            {
                $group: {
                    _id: "$eventData.pointOfInterest", 
                    data: { $max: "$eventData." + fieldName }
                }
            },
            { $sort: { data: -1 } },
            { $limit: count}
        ], 
        function (err, result) {

            if (err)
                return res.json(err);
        
            var labelArray = [],
                dataArray = [];
        
            for (var i = 0, len = result.length; i < len; i++) {
                labelArray[i] = result[i]._id;
                dataArray[i] = result[i].data
            }
        
            res.json({
                labelArray: labelArray,
                dataArray: dataArray
            });
    });
});

module.exports = router;