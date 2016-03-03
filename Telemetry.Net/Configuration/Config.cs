using System.Configuration;
using Telemetry.Net.Exceptions;

namespace Telemetry.Net.Configuration
{
    public static class Config
    {
        private static string urlConfigKey = "telemetryUrl",
                              appNameConfigKey = "applicationName";

        private static string endpoint = ConfigurationManager.AppSettings[urlConfigKey] ?? string.Empty;
        private static string applicationName = ConfigurationManager.AppSettings["applicationName"] ?? string.Empty;

        static Config()
        {
            if (string.IsNullOrWhiteSpace(endpoint))
            {
                throw new TelemetryConfigurationException(string.Format("The '{0}' key cannot be found in the application configuration.", urlConfigKey));
            }

            if (string.IsNullOrWhiteSpace(applicationName))
            {
                throw new TelemetryConfigurationException(string.Format("The '{0}' key cannot be found in the application configuration.", appNameConfigKey));
            }
        }

        public static string ApplicationName
        {
            get
            {
                return applicationName;
            }
        }

        public static string TelemetryEndpoint
        {
            get
            {
                return endpoint;
            }
        }
    }
}
