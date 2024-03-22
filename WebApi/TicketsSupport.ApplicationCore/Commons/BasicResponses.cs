using System.Text.Json.Serialization;

namespace TicketsSupport.ApplicationCore.Commons
{
    public class BasicResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }
}
