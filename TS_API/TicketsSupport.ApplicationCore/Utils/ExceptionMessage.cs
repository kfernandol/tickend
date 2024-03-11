using TicketsSupport.ApplicationCore.Exceptions;

namespace TicketsSupport.ApplicationCore.Utils
{
    public class ExceptionMessage
    {
        public static string NoAssigned(string ElementName, string ElementNameUnassigned)
        {
            string message = ResourcesUtils.GetExceptionDetails("NotAssignedDetail");
            return string.Format(message, ElementName, ElementNameUnassigned);
        }

        public static string NotFound(string ElementName, string ElementValue)
        {
            string message = ResourcesUtils.GetExceptionDetails("NotFoundDetailWithValue");
            return string.Format(message, ElementName, ElementValue);
        }

        public static string NotFound(string ElementName)
        {
            string message = ResourcesUtils.GetExceptionDetails("NotFoundDetail");
            return string.Format(message, ElementName);
        }

        public static string Invalid(string ElementName)
        {
            string messsage = ResourcesUtils.GetExceptionDetails("InvalidDetail");

            return string.Format(messsage, ElementName);
        }

        public static string NotAuthenticated()
        {
            string messsage = ResourcesUtils.GetExceptionDetails("NoAuthenticatedDetail");

            return string.Format(messsage);
        }
    }
}
