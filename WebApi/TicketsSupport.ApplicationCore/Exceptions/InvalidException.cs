using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Resources;
using System.Text;
using System.Threading.Tasks;
using TicketsSupport.ApplicationCore.Utils;

namespace TicketsSupport.ApplicationCore.Exceptions
{
    public class InvalidException : BasicApiException
    {
        private int ErrorCode = 400;
        private string DefaultMessage = ResourcesUtils.GetExceptionMessage("InvalidError");

        public InvalidException(string details) : base(details)
        {
            base.ErrorCode = ErrorCode;
            base.Message = DefaultMessage;
            base.Details = details;
        }
    }
}
