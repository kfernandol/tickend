using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using TicketsSupport.ApplicationCore.Resources.Properties;

namespace TicketsSupport.ApplicationCore.DTOs
{
    public class UpdateProfileRequest
    {
        public IFormFile? Photo { get; set; }

        [MaxLength(150, ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldMaxLength))]
        public string? FirstName { get; set; }

        [MaxLength(150, ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldMaxLength))]
        public string? LastName { get; set; }

        [MaxLength(100, ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldMaxLength))]
        public string? Password { get; set; }

        [MaxLength(200, ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldMaxLength))]
        public string? Email { get; set; }
    }
}
