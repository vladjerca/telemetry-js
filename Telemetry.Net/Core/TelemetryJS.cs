using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Configuration;
using System.IO;
using System.Net;
using Telemetry.Net.DataModel;
using Telemetry.Net.Exceptions;
using Telemetry.Net.Security;

namespace Telemetry.Net.Core
{
    public static class TelemetryJS
    {
        private static string endpoint = ConfigurationManager.AppSettings["telemetryUrl"] ?? string.Empty;

        private static JsonSerializerSettings serializationSettings = new JsonSerializerSettings()
                                                                    {
                                                                        ContractResolver = new CamelCasePropertyNamesContractResolver(),
                                                                        NullValueHandling = NullValueHandling.Ignore,                                                                        
                                                                    };

        static TelemetryJS()
        {
            if (string.IsNullOrWhiteSpace(endpoint))
            {
                throw new TelemetryConfigurationException(string.Format("The 'telemetryUrl' key cannot be found in the application configuration."));
            }
        }

        public static string Log(TelemetryData details, bool useAuthToken = false)
        {
            var result = string.Empty;

            try
            {
                var request = WebRequest.Create(endpoint);
                request.ContentType = "application/json";
                request.Method = "POST";

                if (useAuthToken)
                    request.Headers.Add("x-access-token", Token.Generate);

                string json = JsonConvert.SerializeObject(details, serializationSettings);

                using (var streamWriter = new StreamWriter(request.GetRequestStream()))
                {
                    streamWriter.Write(json);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                var response = request.GetResponse();

                using (var streamReader = new StreamReader(response.GetResponseStream()))
                {
                    result = streamReader.ReadToEnd();
                }
            }
            catch(Exception e)
            {
                result = e.Message;
            }
            
            return result;
        }
    }
}
