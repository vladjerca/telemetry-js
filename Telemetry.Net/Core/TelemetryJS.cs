﻿using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Telemetry.Net.Configuration;
using Telemetry.Net.DataModel;
using Telemetry.Net.Security;

namespace Telemetry.Net.Core
{
    public static class TelemetryJs
    {
        private static readonly JsonSerializerSettings SerializationSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            NullValueHandling = NullValueHandling.Ignore
        };

        private static WebRequest GenerateRequest(bool useAuthToken)
        {
            var request = WebRequest.Create(Config.TelemetryEndpoint);
            request.ContentType = "application/json";
            request.Method = "POST";

            if (useAuthToken)
                request.Headers.Add("x-access-token", Token.Generate);

            return request;
        }

        public static string Log(TelemetryData details, bool useAuthToken = false)
        {
            string result;

            if (string.IsNullOrWhiteSpace(details.ApplicationName))
                details.ApplicationName = Config.ApplicationName;

            try
            {
                var request = GenerateRequest(useAuthToken);

                var json = JsonConvert.SerializeObject(details, SerializationSettings);

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
            catch (Exception e)
            {
                result = e.Message;
            }

            return result;
        }

        public static async Task<string> LogAsync(TelemetryData details, bool useAuthToken = false)
        {
            string result;

            if (string.IsNullOrWhiteSpace(details.ApplicationName))
                details.ApplicationName = Config.ApplicationName;

            try
            {
                var request = GenerateRequest(useAuthToken);

                var json = JsonConvert.SerializeObject(details, SerializationSettings);

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