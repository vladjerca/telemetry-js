var telemetryDb = require('../models/telemetry');
var express = require('express');
var router = express.Router();

var telemetry = (function () {
    var projectionTypes = {
        annualy: 'annualy',
        monthly: 'monthly'
    };

    function aggregateByField(options, callback) {
        options.limit = parseInt(options.limit) || 0;
        
        var aggregationOptions = [];
        
        aggregationOptions.push({
            $match: {
                applicationName: options.applicationName, 
                eventType: options.eventType
            }
        });
        aggregationOptions.push({
            $match: {
                applicationName: options.applicationName, 
                eventType: options.eventType
            }
        });
        aggregationOptions.push({
            $group: {
                _id: "$eventData." + options.fieldName, 
                data: (options.maxEntry ? { $max: "$eventData." + options.maxEntry.fieldName } : { $sum: 1 })
            }
        });
        aggregationOptions.push({
            $sort: {
                data: -1
            }
        });
        
        if (options.limit > 0)
            aggregationOptions.push({
                $limit: options.limit
            });
        
        telemetryDb.aggregate(aggregationOptions, function (err, result) {
            var fields = [],
                data = [];
            
            if (!err) {
                for (var i = 0, len = result.length; i < len; i++) {
                    fields[i] = result[i]._id;
                    data[i] = result[i].data;
                }
            }
            
            callback(err, {
                fields: fields,
                data: data
            });
        });
    };
    
    function aggregateAndProject(options, callback) {
        
        var aggregationOptions = [];
        
        aggregationOptions.push({
            $match: {
                applicationName: options.applicationName, 
                eventType: options.eventType
            }
        });
        
        var isMonthly = options.projectionType === projectionTypes.monthly;
        
        var projection = {};        
        projection.year = { $year: "$timestamp" };

        var groupId = {};
        groupId.year = "$year";

        if (isMonthly) {
            projection.month = { $month: "$timestamp" };
            groupId.$month = "$month";
        }

        aggregateOptions.push({
            $project: projection
        });
        aggregateOptions.push({
            $group: {
                _id: groupId, 
                data: { $sum: 1 }
            }
        });

        aggregateOptions.push({
            $sort: { data: -1 }
        });

        telemetryDb.aggregate(aggregationOptions, function (err, result) {
            var fields = [],
                data = [];

            if (!err) {
                for (var i = 0, len = result.length; i < len; i++) {
                    fields[i] = result[i]._id.year + (isMonthly ? '/' + result[i]._id.month : '');
                    data[i] = result[i].data
                }
            }

            callback(err, {
                fields: fields,
                data: data
            })
        });
    };

    return {
        aggregateByField: aggregateByField,
        aggregateAndProject: aggregateAndProject,
        projectionTypes: projectionTypes
    };
})();

router.route('/applicationStatistics/forApp/:appName/countEvent/:eventType')
.get(function (req, res) {
    var appName = req.params.appName,
        eventType = req.params.eventType;

    telemetryDb.count({
                        applicationName: appName, 
                        eventType: eventType
    }, 
    function (err, count) {
        if (err)
            return res.send(err);
        
        return res.json({
            application: appName,
            eventType: eventType,
            eventCount: count
        });
    });
});

router.route('/applicationStatistics/forApp/:appName/countEvent/:eventType/monthly/')
.get(function (req, res) {
    var appName = req.params.appName,
        eventType = req.params.eventType;
    
    telemetry.aggregateAndProject({
        applicationName: appName, 
        eventType: eventType, 
        projectionType: telemetry.projectionTypes.monthly
    }, function (err, result) {
        if (err)
            return res.json(err);
        return res.json(result);
    });
});

router.route('/applicationStatistics/forApp/:appName/countEvent/:eventType/annualy/')
.get(function (req, res) {
    var appName = req.params.appName,
        eventType = req.params.eventType;
    
    telemetry.aggregateAndProject({
        applicationName: appName, 
        eventType: eventType, 
        projectionType: telemetry.projectionTypes.annualy
    }, function (err, result) {
        if (err)
            return res.json(err);
        return res.json(result);
    });
});

router.route('/applicationStatistics/forApp/:appName/:eventType/groupBy/:field/')
.get(function (req, res) {
	var appName = req.params.appName,
		eventType = req.params.eventType,
        fieldName = req.params.field;

    telemetry.aggregateByField({
        applicationName: appName, 
        eventType: eventType, 
        fieldName: fieldName
    }, function (err, result) {
        if (err)
            return res.json(err);        
        return res.json(result);
    });
});

router.route('/applicationStatistics/forApp/:appName/:eventType/groupBy/:field/countFor/:max')
.get(function (req, res) {
    var appName = req.params.appName,
        eventType = req.params.eventType,
        fieldName = req.params.field,
        count = req.params.max;

    telemetry.aggregateByField({
        applicationName: appName, 
        eventType: eventType, 
        fieldName: fieldName,
        limit: max
    }, function (err, result) {
        if (err)
            return res.json(err);
        return res.json(result);
    });
});

router.route('/applicationStatistics/forApp/:appName/:eventType/groupBy/:groupField/getMaxFor/:maxField/top/:count')
.get(function (req, res) {
    var appName = req.params.appName,
        eventType = req.params.eventType,
        fieldName = req.params.groupField,
        maxField = req.params.maxField,
        count = parseInt(req.params.count) || 0;

    telemetry.aggregateByField({
        applicationName: appName, 
        eventType: eventType, 
        fieldName: fieldName,
        limit: max,
        maxEntry: {
            fieldName: req.params.maxField
        }
    }, function (err, result) {
        if (err)
            return res.json(err);
        return res.json(result);
    });
});

module.exports = router;