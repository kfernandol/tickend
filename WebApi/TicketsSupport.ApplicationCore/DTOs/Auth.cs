using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.DTOs
{
    public class AuthRequest
    {
        [MaxLength(50)]
        public string Username { get; set; }

        [MaxLength(50)]
        public string Password { get; set; }
    }

    public class AuthResponse
    {
        public string Token { get; set; }
        public int ExpirationMin { get; set; }
        public string TokenType { get; set; }
        public string RefreshToken { get; set; }
    }
}
