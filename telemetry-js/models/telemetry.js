var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var telemetrySchema = new Schema({
    applicationName: {
        type: String,
        index: true,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    eventType: {
        type: String,
        index: true,
        required: true
    },
    eventData: Schema.Types.Mixed
});

module.exports = mongoose.model("Telemetry", telemetrySchema);