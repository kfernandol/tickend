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
            var resourceManager = new ResourceManager("TicketsSupport.ApplicationCore.Resources.Exceptions.Messages.ExceptionMessages", Assembly.GetExecutingAssembly());
            return resourceManager?.GetString(nameInResource);
        }

        public static string? GetExceptionDetails(string nameInResource)
        {
            var resourceManager = new ResourceManager("TicketsSupport.ApplicationCore.Resources.Exceptions.Details.ExceptionDetails", Assembly.GetExecutingAssembly());
            return resourceManager?.GetString(nameInResource);
        }

        public static string? GetResponseMessage(string nameInResource)
        {
            var resourceManager = new ResourceManager("TicketsSupport.ApplicationCore.Resources.Responses.Messages.ResponseMessages", Assembly.GetExecutingAssembly());
            return resourceManager?.GetString(nameInResource);
        }

        public static string? GetEmailResetPassword(string nameInResource)
        {
            var resourceManager = new ResourceManager("TicketsSupport.ApplicationCore.Resources.Emails.ResetPassword.ResetPassword", Assembly.GetExecutingAssembly());
            return resourceManager?.GetString(nameInResource);
        }

        public static string? GetEmailTicketCreate(string nameInResource)
        {
            var resourceManager = new ResourceManager("TicketsSupport.ApplicationCore.Resources.Emails.TicketCreated.TicketCreated", Assembly.GetExecutingAssembly());
            return resourceManager?.GetString(nameInResource);
        }
    }
}
