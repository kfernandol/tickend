namespace TicketsSupport.ApplicationCore.Utils
{
    public static class GeneratorsRandom
    {
        public static string Username(string? firstName, string? lastName, string? email)
        {
            string timestamp = DateTime.Now.ToString("ss");

            string firstNamePart = !string.IsNullOrWhiteSpace(firstName) && firstName.Length >= 2 ? firstName.Substring(0, 2) : timestamp;
            string lastNamePart = !string.IsNullOrWhiteSpace(lastName) && lastName.Length >= 2 ? lastName.Substring(0, 2) : timestamp;
            string emailPart = !string.IsNullOrWhiteSpace(email) && email.Length >= 2 ? email.Substring(0, 2) : timestamp;

            string username = $"{firstNamePart}{lastNamePart}{emailPart}{timestamp}";

            return username;
        }
    }
}
