namespace TicketsSupport.ApplicationCore.Configuration
{
    public class ConfigJWT
    {
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public string Key { get; set; }
        public int ExpirationMin { get; set; }
        public int ExpirationRefreshTokenMin { get; set; }
        public string TokenType { get; set; }
    }
}
