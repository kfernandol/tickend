using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsSupport.ApplicationCore.Utils
{
    public static class DetectUtils
    {
        public static string DetectImageFormat(byte[] imageBytes)
        {
            // Definir los encabezados de los formatos de imagen más comunes
            var pngHeader = new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A };
            var jpegHeader = new byte[] { 0xFF, 0xD8 };
            var gifHeader = new byte[] { 0x47, 0x49, 0x46, 0x38 };

            // Verificar si los bytes de la imagen comienzan con el encabezado de cada formato
            if (imageBytes.Length >= pngHeader.Length && imageBytes.Take(pngHeader.Length).SequenceEqual(pngHeader))
                return "png";
            else if (imageBytes.Length >= jpegHeader.Length && imageBytes.Take(jpegHeader.Length).SequenceEqual(jpegHeader))
                return "jpeg";
            else if (imageBytes.Length >= gifHeader.Length && imageBytes.Take(gifHeader.Length).SequenceEqual(gifHeader))
                return "gif";

            // Si no se reconoce el formato, devolver "png" por defecto
            return "png";
        }
    }
}
