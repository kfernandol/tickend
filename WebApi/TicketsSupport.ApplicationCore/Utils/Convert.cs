using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsSupport.ApplicationCore.Utils
{
    public static class DataConverter
    {
        public static Stream Base64ToStream(string base64String)
        {
            byte[] imageBytes = Convert.FromBase64String(base64String);
            using (MemoryStream memoryStream = new MemoryStream(imageBytes))
            {
                return new MemoryStream(memoryStream.ToArray());
            }
        }
    }
}
