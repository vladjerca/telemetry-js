using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Configuration;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Telemetry.Net.DataModel;
using Telemetry.Net.Exceptions;
using Telemetry.Net.Security;

namespace Telemetry.Net.Core
{
    public static class TelemetryJS
    {
        private static string urlConfigKey = "telemetryUrl";
        private static string endpoint = ConfigurationManager.AppSettings[urlConfigKey] ?? string.Empty;

        private static JsonSerializerSettings serializationSettings = new JsonSerializerSettings()
                                                                    {
                                                                        ContractResolver = new CamelCasePropertyNamesContractResolver(),
                                                                        NullValueHandling = NullValueHandling.Ignore,                                                                        
                                                                    };

        static TelemetryJS()
        {
            if (string.IsNullOrWhiteSpace(endpoint))
            {
                throw new TelemetryConfigurationException(string.Format("The '{0}' key cannot be found in the application configuration.", urlConfigKey));
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

        public static async Task<string> LogAsync(TelemetryData details, bool useAuthToken = false)
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

                using (var streamWriter = new StreamWriter(await request.GetRequestStreamAsync()))
                {
                    streamWriter.Write(json);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                var response = await request.GetResponseAsync();
                
                using (var streamReader = new StreamReader(response.GetResponseStream()))
                {
                    result = await streamReader.ReadToEndAsync();
                }
            }
            catch (Exception e)
            {
                result = e.Message;
            }

            return result;
        }
    }
}
