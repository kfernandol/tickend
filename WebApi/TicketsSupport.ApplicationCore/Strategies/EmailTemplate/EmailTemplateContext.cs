using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsSupport.ApplicationCore.Strategies.EmailTemplate
{
    public class EmailTemplateContext
    {
        private EmailTemplateStrategy emailTemplateStrategy;

        public void SetEmailTemplateStrategy(TicketsSupport.EmailTemplate template)
        {
            switch (template)
            {
                case TicketsSupport.EmailTemplate.EmailBtnLink:
                    emailTemplateStrategy = new EmailBtnLinkTemplateStrategy();
                    break;
                case TicketsSupport.EmailTemplate.TicketCreate:
                    emailTemplateStrategy = new TicketCreatedTemplateStrategy();
                    break;
                case TicketsSupport.EmailTemplate.SimpleMessage:
                    emailTemplateStrategy = new SimpleMessageTemplateStrategy();
                    break;
            }
        }

        public (string templateHtml, string subject) GetContentTemplate(string from, string templatePath, Dictionary<string, string> templateData)
        {
            return emailTemplateStrategy.GetEmailContent(from, templatePath, templateData);
        }
    }
}
