using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TicketsSupport.ApplicationCore.Configuration;
using TicketsSupport.ApplicationCore.Strategies.EmailTemplate;
using TicketsSupport.ApplicationCore.Utils;

namespace TicketsSupport.Infrastructure.Services.Email
{
    public class EmailSender : IEmailSender
    {
        public readonly EmailConfig _emailConfig;
        public readonly SmtpClient _smtpClient;
        public readonly EmailTemplateContext _emailTemplate;
        public EmailSender(IOptions<EmailConfig> emailConfig, EmailTemplateContext emailTemplate)
        {
            _emailConfig = emailConfig.Value;
            _emailTemplate = emailTemplate;
            _smtpClient = new SmtpClient(_emailConfig.Server, _emailConfig.Port);

            //extra config Email
            if (_emailConfig.SSL == true)
                _smtpClient.EnableSsl = true;

            if (!string.IsNullOrWhiteSpace(_emailConfig.Username) && !string.IsNullOrWhiteSpace(_emailConfig.Password))
                _smtpClient.Credentials = new NetworkCredential(_emailConfig.Username, _emailConfig.Password);
        }

        public async Task<(string subject, string to)> SendEmail(string to, string subject, EmailTemplate template, Dictionary<string, string> templateData)
        {
            string From = _emailConfig.From;
            string templateHtml;
            EmailTemplateStrategy emailTemplate;

            //Templates paths
            var currentDirectory = Directory.GetCurrentDirectory();
            string templatePath = Path.Combine(currentDirectory, "..", "TicketsSupport.ApplicationCore", "EmailTemplates", "html");

            //Get Html with default values
            _emailTemplate.SetEmailTemplateStrategy(template);
            var templateContent = _emailTemplate.GetContentTemplate(From, templatePath, templateData);
            templateHtml = templateContent.templateHtml;
            subject = string.IsNullOrEmpty(subject) ? templateContent.subject : subject;

            //Set values in templateData
            foreach (var data in templateData)
            {
                templateHtml = templateHtml.Replace("{{" + data.Key + "}}", data.Value);
            }

            MailMessage message = new MailMessage
            {
                From = new MailAddress(From),
                Subject = subject,
                IsBodyHtml = true
            };

            templateHtml = ReplaceBase64ImagesWithCIDs(ref message, templateHtml);

            message.Body = templateHtml;
            message.To.Add(new MailAddress(to));

            _smtpClient.Send(message);

            return (subject, to);
        }

        public async Task<(string subject, string to)> ReplyEmailTicket(string to, string originalSubjet, string HtmlEmail)
        {
            string From = _emailConfig.From;
            string subject = $"RE: {originalSubjet}";


            MailMessage replyMessage = new MailMessage
            {
                From = new MailAddress(From),
                Subject = subject,
                IsBodyHtml = true
            };

            HtmlEmail = ReplaceBase64ImagesWithCIDs(ref replyMessage, HtmlEmail);

            replyMessage.Body = HtmlEmail;
            replyMessage.To.Add(new MailAddress(to));
            replyMessage.ReplyToList.Add(new MailAddress(to));

            _smtpClient.Send(replyMessage);

            return (subject, to);
        }

        private string ReplaceBase64ImagesWithCIDs(ref MailMessage message, string htmlTemplate)
        {
            var base64ImageRegex = new Regex(@"data:image\/[a-zA-Z]*;base64,([^\""']*)");
            var matches = base64ImageRegex.Matches(htmlTemplate);

            foreach (Match match in matches)
            {
                //create attachment from base64
                Attachment attachment = new Attachment(DataConverter.Base64ToStream(match.Value.Split(',')[1]), new ContentType { MediaType = MediaTypeNames.Image.Png });
                attachment.TransferEncoding = TransferEncoding.Base64;
                attachment.ContentId = Guid.NewGuid().ToString();
                message.Attachments.Add(attachment);

                //remplace base64 to cid
                string cid = $"cid:{attachment.ContentId}";
                htmlTemplate = htmlTemplate.Replace(match.Value, $"{cid}");
            }

            return htmlTemplate;
        }
    }
}
