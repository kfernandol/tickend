using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsSupport.ApplicationCore.Resources.Properties;

namespace TicketsSupport.ApplicationCore.DTOs
{
    public class RefreshTokenRequest
    {
        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        public string RefreshToken { get; set; }

        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        public string Username { get; set; }

        public int? OrganizationId { get; set; }
    }
}
