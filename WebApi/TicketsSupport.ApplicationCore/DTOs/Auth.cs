using System.ComponentModel.DataAnnotations;
using TicketsSupport.ApplicationCore.Resources.Properties;

namespace TicketsSupport.ApplicationCore.DTOs
{
    public class AuthRequest
    {
        [MaxLength(50, ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldMaxLength))]
        public string Username { get; set; }

        [MaxLength(50, ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldMaxLength))]
        [MinLength(5, ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldMinLength))]
        public string Password { get; set; }
    }

    public class AuthGoogleRequest
    {
        public string access_token { get; set; }
        public string? authuser { get; set; }
        public int expires_in { get; set; }
        public string? prompt { get; set; }
        public string? scope { get; set; }
        public string token_type { get; set; }
    }

    public class AuthResponse
    {
        public string Token { get; set; }
        public int ExpirationMin { get; set; }
        public string TokenType { get; set; }
        public string RefreshToken { get; set; }
    }
}
