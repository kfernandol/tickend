using Microsoft.Extensions.Logging;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Resources;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using TicketsSupport.ApplicationCore.Utils;

namespace TicketsSupport.ApplicationCore.Exceptions
{
    public class BasicApiException : Exception
    {
        public int ErrorCode { get; set; } = 500;
        public string Details { get; set; } = "";
        public string Message { get; set; } = ResourcesUtils.GetExceptionMessage("InternalServerError");

        public BasicApiException(string detailsException) : base(detailsException)
        {
            Details = detailsException;
        }
    }
}
