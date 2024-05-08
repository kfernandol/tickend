namespace TicketsSupport.Infrastructure.Services.Email
{
    public interface IEmailSender
    {
        Task<(string subject, string to)> SendEmail(string to, string subject, EmailTemplate template, Dictionary<string, string> templateData);
        Task<(string subject, string to)> ReplyEmailTicket(string to, string originalSubjet, string HtmlEmail);
    }
}
