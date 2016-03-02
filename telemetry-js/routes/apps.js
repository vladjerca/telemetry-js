var telemetryDb = require('../models/telemetry');
var express = require('express');
var router = express.Router();

router.route('/apps')
// GET ALL ENTRIES
.get(function (req, res) {
    telemetryDb.distinct('applicationName', function (err, applications) { 
        if (err)
            res.send(err);

        res.json(applications);
    });
});

router.route('/apps/:applicationName/event-count')
.get(function (req, res) {
    var appName = req.params.applicationName;

    telemetryDb.aggregate([
        {
            $match: { applicationName : appName }
        },
        {
            $group: {
                _id: { applicationName: "$applicationName", eventType: "$eventType" }, 
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ], function (err, result) {
        if (err)
            return res.json(err);

        var dataArray = [],
            labelArray = [];

        for (var i = 0; i < result.length; i++) {
            labelArray[i] = result[i]._id.eventType;
            dataArray[i] = result[i].count;
        }

        res.json({
            labelArray: labelArray,
            dataArray: dataArray
        });
    });
});

router.route('/apps/event-count')
.get(function (req, res) { 
    telemetryDb.aggregate([
        {
            $match: {}
        },
        {
            $group: {
                _id: "$applicationName", 
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ], function (err, result) {
        if (err)
            return res.json(err);

        var normalizedResult = [];

        for (var i = 0; i < result.length; i++) {
            normalizedResult[i] = {};
            normalizedResult[i].applicationName = result[i]._id;
            normalizedResult[i].count = result[i].count;
        }

        res.json(normalizedResult);
    });
});

module.exports = router;