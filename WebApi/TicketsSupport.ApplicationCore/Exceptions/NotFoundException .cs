using Microsoft.Extensions.Localization;
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
    public class NotFoundException : BasicApiException
    {

        private int NotFoundErrorCode = 404;
        private string DefaultMessage = ResourcesUtils.GetExceptionMessage("NotFoundError");

        public NotFoundException(string details) : base(details)
        {
            base.ErrorCode = NotFoundErrorCode;
            base.Message = DefaultMessage;
            base.Details = details;
        }
    }
}
