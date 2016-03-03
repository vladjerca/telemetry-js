using System;
using Telemetry.Net.Core;
using Telemetry.Net.DataModel;
using Telemetry.Net.Enums;
using Telemetry.Test.Example;

namespace Telemetry.Example
{
    class Program
    {
        static void Main(string[] args)
        {
            Go();
            Console.WriteLine("Wait for reply...");
            Console.ReadLine();
        }

        public static async void Go()
        {
            string response = await TelemetryJS.LogAsync(new TelemetryData()
            {
                ApplicationName = "Test",
                EventType = EventType.UserEvent,
                EventData = new TestData
                {
                    StringMember = "I'm a string",
                    IntMember = 1337,
                    DoubleMember = 13.37,
                    ObjectMember = new
                    {
                        Something = Environment.ProcessorCount,
                        SomethingMore = Environment.TickCount
                    }
                }
            }, true);

            Console.WriteLine(response);
        }
    }
}
