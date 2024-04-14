using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TicketsSupport.ApplicationCore.Configuration;
using TicketsSupport.ApplicationCore.Utils;

namespace TicketsSupport.Infrastructure.Services.Email
{
    public class EmailSender : IEmailSender
    {
        public readonly EmailConfig _emailConfig;
        public readonly SmtpClient _smtpClient;
        public EmailSender(IOptions<EmailConfig> emailConfig)
        {
            _emailConfig = emailConfig.Value;
            _smtpClient = new SmtpClient(_emailConfig.Server, _emailConfig.Port);
        }

        public async Task SendEmail(string to, EmailTemplate template, Dictionary<string, string> templateData)
        {
            string From = _emailConfig.From;
            string templateHtml = "";
            string subject = "";

            //Templates paths
            var currentDirectory = Directory.GetCurrentDirectory();
            string templatePath = Path.Combine(currentDirectory, "..", "TicketsSupport.ApplicationCore", "EmailTemplates");

            //Get Html with default values
            switch (template)
            {
                case EmailTemplate.ResetPassword:
                    var data = await GetHtmlResetPassword(From, templatePath);
                    templateHtml = data.templateHtml;
                    subject = data.subject;
                    break;
            }

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

        private async Task<(string templateHtml, string subject)> GetHtmlResetPassword(string From, string TemplatePath)
        {

            string templatePath = Path.Combine(TemplatePath, "ResetPassword.html");
            string templateHtml = File.ReadAllText(templatePath);

            Dictionary<string, string> templateDefaultValues = new Dictionary<string, string>
            {
                {"Saludation", ResourcesUtils.GetEmailResetPassword("Saludation")},
                {"Message", ResourcesUtils.GetEmailResetPassword("Message")},
                {"ResetPasswordBtn", ResourcesUtils.GetEmailResetPassword("ResetPasswordBtn")},
                {"WarningMessage", ResourcesUtils.GetEmailResetPassword("WarningMessage")},
                {"From", From }
            };

            foreach (var data in templateDefaultValues)
            {
                templateHtml = templateHtml.Replace("{{" + data.Key + "}}", data.Value);
            }

            var subject = ResourcesUtils.GetEmailResetPassword("Subject");

            return (templateHtml, subject);
        }
    }
}
