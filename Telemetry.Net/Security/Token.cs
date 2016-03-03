using Jose;
using System.Collections.Generic;
using System.Configuration;

namespace Telemetry.Net.Security
{
    public static class Token
    {
        // change this for personal builds
        private static byte[] secretKey = new byte[] { 164, 60, 194, 0, 161, 189, 41, 38, 130, 89, 141, 164, 45, 170, 159, 209, 69, 137, 243, 216, 191, 131, 47, 250, 32, 107, 231, 117, 37, 158, 225, 234 };

        private static Dictionary<string, object> payload = new Dictionary<string, object>
        {
            // set this in the connection string for easy cycles - server can also check for a friendly app name to give permission
            { "applicationName", ConfigurationManager.AppSettings["applicationName"] },
            // change this and leave it in the binary
            { "somethingDearToYou", "dEaDpOol" }
        };

        public static string Generate
        {
            get
            {
                return JWT.Encode(payload, secretKey, JwsAlgorithm.HS256);
            }
        }
    }
}
