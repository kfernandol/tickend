namespace TicketsSupport.ApplicationCore.Models
{
    public class GoogleOAuthResponse
    {
        public string Sub { get; set; }
        public string Name { get; set; }
        public string Given_name { get; set; }
        public string Family_name { get; set; }
        public string Picture { get; set; }
        public string Email { get; set; }
        public bool Email_verified { get; set; }
        public string Locale { get; set; }
    }
}
