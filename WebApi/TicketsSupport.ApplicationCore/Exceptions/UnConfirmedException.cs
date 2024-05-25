using TicketsSupport.ApplicationCore.Utils;

namespace TicketsSupport.ApplicationCore.Exceptions
{
    public class UnConfirmedException : BasicApiException
    {
        private int NotFoundErrorCode = 403;
        private string DefaultMessage = ResourcesUtils.GetExceptionMessage("UnConfirmedError");

        public UnConfirmedException(string details) : base(details)
        {
            base.ErrorCode = NotFoundErrorCode;
            base.Message = DefaultMessage;
            base.Details = details;
        }
    }
}
