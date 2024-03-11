using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsSupport.ApplicationCore.Utils;

namespace TicketsSupport.ApplicationCore.Exceptions
{
    public class NoAuthenticatedException : BasicApiException
    {
        private int ErrorCode = 401;
        private string DefaultMessage = ResourcesUtils.GetExceptionMessage("InvalidError");

        public NoAuthenticatedException(string details) : base(details)
        {
            base.ErrorCode = ErrorCode;
            base.Message = DefaultMessage;
            base.Details = details;
        }
    }
}
