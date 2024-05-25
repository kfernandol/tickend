using System.Reflection;
using System.Resources;

namespace TicketsSupport.ApplicationCore.Utils
{
    public class ResourcesUtils
    {
        /// <summary>
        ///  Get string value of ExceptionMessages in resources
        /// </summary>
        /// <param name="Name">Name string in resource file</param>
        /// <returns>Return value of Resource</returns>
        public static string? GetExceptionMessage(string nameInResource)
        {
            return GetResourceManager("TicketsSupport.ApplicationCore.Resources.Exceptions.Messages.ExceptionMessages").GetString(nameInResource);
        }

        public static string? GetExceptionDetails(string nameInResource)
        {
            return GetResourceManager("TicketsSupport.ApplicationCore.Resources.Exceptions.Details.ExceptionDetails").GetString(nameInResource);
        }

        public static string? GetResponseMessage(string nameInResource)
        {
            return GetResourceManager("TicketsSupport.ApplicationCore.Resources.Responses.Messages.ResponseMessages").GetString(nameInResource);
        }

        public static string? GetEmailBtnLink(string nameInResource)
        {
            return GetResourceManager("TicketsSupport.ApplicationCore.Resources.Emails.EmailBtnLink.EmailBtnLink").GetString(nameInResource);
        }

        public static string? GetEmailTicketCreate(string nameInResource)
        {
            return GetResourceManager("TicketsSupport.ApplicationCore.Resources.Emails.TicketCreated.TicketCreated").GetString(nameInResource);
        }

        public static string? GetEmailSimpleMessage(string nameInResource)
        {
            return GetResourceManager("TicketsSupport.ApplicationCore.Resources.Emails.SimpleMessage.SimpleMessage").GetString(nameInResource);
        }

        private static ResourceManager GetResourceManager(string baseName)
        {
            return new ResourceManager(baseName, Assembly.GetExecutingAssembly());
        }
    }
}
