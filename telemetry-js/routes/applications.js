var telemetryDb = require("../models/telemetry");
var express = require("express");
var router = express.Router();

router.route("/applicationList")
    .get(function(req, res) {
        telemetryDb.distinct("applicationName", function(err, applications) {
            if (err)
                res.send(err);

            res.json(applications);
        });
    });

module.exports = router;