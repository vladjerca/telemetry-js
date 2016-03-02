using Telemetry.Net.Interfaces;

namespace Telemetry.Test.Example
{
    public class TestData : IEventData
    {
        public string StringMember { get; set; }
        public int IntMember { get; set; }
        public double DoubleMember { get; set; }
        public object ObjectMember { get; set; }
    }
}
