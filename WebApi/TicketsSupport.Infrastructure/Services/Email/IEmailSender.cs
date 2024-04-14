namespace TicketsSupport.Infrastructure.Services.Email
{
    public interface IEmailSender
    {
        Task SendEmail(string to, EmailTemplate template, Dictionary<string, string> templateData);
    }
}
