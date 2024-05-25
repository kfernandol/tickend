using System.Resources;
using TicketsSupport.ApplicationCore.Exceptions;

namespace TicketsSupport.ApplicationCore.Utils
{
    public static class ExceptionMessage
    {
        #region Properties Exception Message (Data Annotations)
        //Properties Template (Data Annotations)
        public static string Required
        {
            get
            {
                string message = ResourcesUtils.GetExceptionDetails("FieldRequired");
                return message;
            }
        }

        public static string FieldMaxLength
        {
            get
            {
                string message = ResourcesUtils.GetExceptionDetails("FieldMaxLength");
                return message;
            }
        }

        public static string FieldRange
        {
            get
            {
                string message = ResourcesUtils.GetExceptionDetails("FieldRange");
                return message;
            }
        }

        public static string FieldInvalid
        {
            get
            {
                string message = ResourcesUtils.GetExceptionDetails("FieldInvalid");
                return message;
            }
        }
        #endregion

        #region Message Template Methods
        //Message Template
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

        public static string Exist(string ElementName)
        {
            string message = ResourcesUtils.GetExceptionDetails("ErrorExistDetail");

            return string.Format(message, ElementName);
        }

        public static string Unconfirmed(string ElementName)
        {
            string messsage = ResourcesUtils.GetExceptionDetails("UnConfirmedDetailsWithValue");

            return string.Format(messsage, ElementName);
        }
        #endregion
    }
}
