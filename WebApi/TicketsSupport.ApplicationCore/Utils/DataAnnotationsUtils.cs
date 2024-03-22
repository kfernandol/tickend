using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsSupport.ApplicationCore.Utils
{
    public static class DataAnnotationsUtils
    {
        public static DisplayAttribute GetDisplayName(string propertyName)
        {
            string message = ResourcesUtils.GetExceptionDetails("FieldRange");
            return new DisplayAttribute { Name = message };
        }
    }
}
