using System;

namespace Telemetry.Net.Exceptions
{
    public class TelemetryConfigurationException : Exception
    {
        public TelemetryConfigurationException()
        {
        }

        public TelemetryConfigurationException(string message) : base(message)
        {
        }
    }
}