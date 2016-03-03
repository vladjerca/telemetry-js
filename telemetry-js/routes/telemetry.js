var telemetryDb = require('../models/telemetry');
var express = require('express');
var router = express.Router();

router.route('/telemetry')
// GET ALL ENTRIES
.get(function (req, res) {
    telemetryDb.find(function (err, telemetrys) {
        if (err)
            return res.send(err);
        
        return res.json(telemetrys);
    });
})

// CREATE ENTRY
.post(function (req, res) {
    var telemetry = new telemetryDb(req.body);
 
    telemetry.save(function (err) {
        if (err)
            return res.send(err);
        
        return res.json({ message: telemetry.applicationName + ' (' + telemetry.eventType + ') added succesfully!' });
    });
});

router.route('/telemetry/:id')
// UPDATE ENTRY
.put(function (req, res) {
    telemetryDb.findOne({ _id: req.params.id }, function (err, telemetry) {
        if (err)
            return res.send(err);
        
        for (prop in req.body) {
            telemetry[prop] = req.body[prop];
        }
        
        telemetry.save(function (err) {
            if (err)
                return res.send(err);
            
            return res.json({ message: telemetry.applicationName + ' (' + telemetry.eventType + ') updated succesfully!' });
        });
    });
})

// GET ENTRY
.get(function (req, res) {
    telemetryDb.findOne({ _id: req.params.id }, function (err, telemetry) {
        if (err)
            return res.send(err);
        
        return res.json(telemetry);
    });
})

// DELETE ENTRY
.delete(function (req, res) {
    telemetryDb.remove({ _id: req.params.id }, function (err, telemetry) {
        if (err)
            return res.send(err);
        
        return res.json({ message: telemetry.applicationName + ' (' + telemetry.eventType + ') deleted succesfully!' });
    });
});

module.exports = router;