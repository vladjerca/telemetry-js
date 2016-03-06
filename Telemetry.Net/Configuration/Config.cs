using System.Collections.Generic;
using System.Configuration;
using Telemetry.Net.Exceptions;

namespace Telemetry.Net.Configuration
{
    public static class Config
    {
        private const string UrlConfigKey = "telemetryUrl";
        private const string AppNameConfigKey = "applicationName";

        public static readonly string TelemetryEndpoint = ConfigurationManager.AppSettings[UrlConfigKey] ??
                                                           string.Empty;

        public static readonly string ApplicationName = ConfigurationManager.AppSettings["applicationName"] ??
                                                        string.Empty;

        internal static readonly Dictionary<string, object> SecurityPayload = new Dictionary<string, object>
        {
            // set this in the connection string for easy cycles - server can also check for a friendly app name to give permission
            {"applicationName", Config.ApplicationName},
            // change this and leave it in the binary
            {"somethingDearToYou", "dEaDpOol"}
        };

        static Config()
        {
            if (string.IsNullOrWhiteSpace(TelemetryEndpoint))
            {
                throw new TelemetryConfigurationException(
                    $"The '{UrlConfigKey}' key cannot be found in the application configuration.");
            }

            if (string.IsNullOrWhiteSpace(ApplicationName))
            {
                throw new TelemetryConfigurationException(
                    $"The '{AppNameConfigKey}' key cannot be found in the application configuration.");
            }
        }
    }
}