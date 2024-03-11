using System.Text.Json.Serialization;
using TicketsSupport.ApplicationCore.Exceptions;

namespace TicketsSupport.ApplicationCore.Commons
{
    public class ErrorResponse
    {
        [JsonPropertyName("code")]
        public int Code { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; }

        [JsonPropertyName("details")]
        public string Details { get; set; }

    }
}
