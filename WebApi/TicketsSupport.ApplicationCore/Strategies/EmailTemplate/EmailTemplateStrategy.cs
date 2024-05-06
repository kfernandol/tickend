using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsSupport.ApplicationCore.Utils;

namespace TicketsSupport.ApplicationCore.Strategies.EmailTemplate
{
    public abstract class EmailTemplateStrategy
    {
        public abstract (string templateHtml, string subject) GetEmailContent(string from, string templatePath, Dictionary<string, string> templateData);
    }

    public class ResetPasswordTemplateStrategy : EmailTemplateStrategy
    {
        private string templateFileName = "ResetPassword.html";
        public override (string templateHtml, string subject) GetEmailContent(string from, string templatePath, Dictionary<string, string> templateData)
        {
            string path = Path.Combine(templatePath, templateFileName);
            string templateHtml = File.ReadAllText(path);

            Dictionary<string, string> templateDefaultValues = new Dictionary<string, string>
            {
                {"Saludation", ResourcesUtils.GetEmailResetPassword("Saludation")},
                {"Message", ResourcesUtils.GetEmailResetPassword("Message")},
                {"ResetPasswordBtn", ResourcesUtils.GetEmailResetPassword("ResetPasswordBtn")},
                {"WarningMessage", ResourcesUtils.GetEmailResetPassword("WarningMessage")},
                {"From", from }
            };

            foreach (var data in templateDefaultValues)
            {
                templateHtml = templateHtml.Replace("{{" + data.Key + "}}", data.Value);
            }

            var subject = ResourcesUtils.GetEmailResetPassword("Subject");

            return (templateHtml, subject);
        }
    }

    public class TicketCreatedTemplateStrategy : EmailTemplateStrategy
    {
        private string templateFileName = "TicketCreated.html";
        public override (string templateHtml, string subject) GetEmailContent(string from, string templatePath, Dictionary<string, string> templateData)
        {
            string path = Path.Combine(templatePath, templateFileName);
            string templateHtml = File.ReadAllText(path);

            Dictionary<string, string> templateDefaultValues = new Dictionary<string, string>
            {
                {"Saludation", ResourcesUtils.GetEmailTicketCreate("Saludation")},
                {"Message", ResourcesUtils.GetEmailTicketCreate("Message")},
                {"DetailsTicketText", ResourcesUtils.GetEmailTicketCreate("DetailsTicket")},
                {"TicketTableTitle", ResourcesUtils.GetEmailTicketCreate("Title")},
                {"TicketTableCreate", ResourcesUtils.GetEmailTicketCreate("Create")},
                {"TicketTableProject", ResourcesUtils.GetEmailTicketCreate("Project")},
                {"TicketTableType", ResourcesUtils.GetEmailTicketCreate("Type")},
                {"TicketTableCreateBy", ResourcesUtils.GetEmailTicketCreate("CreateBy")},
                {"ViewTicketBtn", ResourcesUtils.GetEmailTicketCreate("ViewTicket")},
                {"WarningMessage", ResourcesUtils.GetEmailTicketCreate("WarningMessage")},
            };

            foreach (var data in templateDefaultValues)
            {
                templateHtml = templateHtml.Replace("{{" + data.Key + "}}", data.Value);
            }

            var subject = ResourcesUtils.GetEmailTicketCreate("Subject");

            return (templateHtml, subject);
        }
    }

    public class SimpleMessageTemplateStrategy : EmailTemplateStrategy
    {
        private string templateFileName = "SimpleMessage.html";

        public override (string templateHtml, string subject) GetEmailContent(string from, string templatePath, Dictionary<string, string> templateData)
        {
            string path = Path.Combine(templatePath, templateFileName);
            string templateHtml = File.ReadAllText(path);

            Dictionary<string, string> templateDefaultValues = new Dictionary<string, string>
            {
                {"Saludation", ResourcesUtils.GetEmailSimpleMessage("Saludation")},
                {"WarningMessage", ResourcesUtils.GetEmailSimpleMessage("WarningMessage")},
                {"From", from }
            };

            foreach (var data in templateDefaultValues)
            {
                templateHtml = templateHtml.Replace("{{" + data.Key + "}}", data.Value);
            }

            var subject = templateData["Subject"];

            return (templateHtml, subject);
        }
    }
}
