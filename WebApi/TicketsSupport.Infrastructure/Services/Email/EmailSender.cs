using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
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
            _smtpClient = new SmtpClient(_emailConfig.Server, _emailConfig.Port);
            _emailTemplate = emailTemplate;
        }

        public async Task SendEmail(string to, EmailTemplate template, Dictionary<string, string> templateData)
        {
            string From = _emailConfig.From;
            string templateHtml;
            string subject;
            EmailTemplateStrategy emailTemplate;

            //Templates paths
            var currentDirectory = Directory.GetCurrentDirectory();
            string templatePath = Path.Combine(currentDirectory, "..", "TicketsSupport.ApplicationCore", "EmailTemplates", "html");

            //Get Html with default values
            _emailTemplate.SetEmailTemplateStrategy(template);
            var templateContent = _emailTemplate.GetContentTemplate(From, templatePath, templateData);
            templateHtml = templateContent.templateHtml;
            subject = templateContent.subject;

            //Set values in templateData
            foreach (var data in templateData)
            {
                templateHtml = templateHtml.Replace("{{" + data.Key + "}}", data.Value);
            }

            MailMessage message = new MailMessage
            {
                From = new MailAddress(From),
                Subject = subject,
                Body = templateHtml,
                IsBodyHtml = true
            };

            message.To.Add(new MailAddress(to));

            _smtpClient.Send(message);
        }
    }
}
