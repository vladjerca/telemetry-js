using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using Telemetry.Net.Interfaces;

namespace Telemetry.Net.DataModel
{
    public class TelemetryData
    {        
        public TelemetryData()
        {
            Timestamp = DateTime.Now.ToUniversalTime();
        }

        public string ApplicationName { get; set; }

        [JsonProperty]
        internal DateTime Timestamp { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public Enum EventType { get; set; }

        public IEventData EventData { get; set; }
    }
}
