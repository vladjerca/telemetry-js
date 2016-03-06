﻿using Jose;
using Telemetry.Net.Configuration;

namespace Telemetry.Net.Security
{
    public static class Token
    {
        // change this for personal builds
        private static readonly byte[] SecretKey =
        {
            164, 60, 194, 0, 161, 189, 41, 38, 130, 89, 141, 164, 45, 170, 159,
            209, 69, 137, 243, 216, 191, 131, 47, 250, 32, 107, 231, 117, 37, 158, 225, 234
        };

        public static string Generate => JWT.Encode(Config.SecurityPayload, SecretKey, JwsAlgorithm.HS256);
    }
}