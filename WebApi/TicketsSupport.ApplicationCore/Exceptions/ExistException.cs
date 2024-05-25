using TicketsSupport.ApplicationCore.Utils;

namespace TicketsSupport.ApplicationCore.Exceptions
{
    public class ExistException : BasicApiException
    {
        private int ErrorCode = 400;
        private string DefaultMessage = ResourcesUtils.GetExceptionMessage("ExistError");

        public ExistException(string details) : base(details)
        {
            base.ErrorCode = ErrorCode;
            base.Message = DefaultMessage;
            base.Details = details;
        }
    }
}
