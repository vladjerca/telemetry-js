using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using Telemetry.Net.Interfaces;

namespace Telemetry.Net.DataModel
{
    public class TelemetryData
    {        
        public string ApplicationName { get; set; }

        public DateTime Date { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public Enum EventType { get; set; }

        public IEventData EventData { get; set; }
    }
}
