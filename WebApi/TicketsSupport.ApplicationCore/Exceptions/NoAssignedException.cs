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
    public class NoAssignedException : BasicApiException
    {
        private int ErrorCode = 409;
        private string DefaultMessage = ResourcesUtils.GetExceptionMessage("NotAssignedError");

        public NoAssignedException(string details) : base(details)
        {
            base.ErrorCode = ErrorCode;
            base.Message = DefaultMessage;
            base.Details = details;
        }
    }
}
