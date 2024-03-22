using Microsoft.Extensions.Localization;
using System.ComponentModel.DataAnnotations;
using System.Security.AccessControl;
using System.Xml.Linq;
using TicketsSupport.ApplicationCore.Resources.Properties;
using TicketsSupport.ApplicationCore.Utils;

namespace TicketsSupport.ApplicationCore.DTOs
{
    public class CreateUserRequest
    {
        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        [MaxLength(150, ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldMaxLength))]
        [Display(Name = "FirstName", ResourceType = typeof(PropertiesLocalitation))]
        public string FirstName { get; set; }

        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        [MaxLength(150, ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldMaxLength))]
        [Display(Name = "LastName", ResourceType = typeof(PropertiesLocalitation))]
        public string LastName { get; set; }

        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        [MaxLength(50, ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldMaxLength))]
        [Display(Name = "Username", ResourceType = typeof(PropertiesLocalitation))]
        public string Username { get; set; }

        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        [MaxLength(200, ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldMaxLength))]
        public string Email { get; set; }

        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        [MaxLength(50, ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldMaxLength))]
        [Display(Name = "Password", ResourceType = typeof(PropertiesLocalitation))]
        public virtual string Password { get; set; }

        [Display(Name = "Rol", ResourceType = typeof(PropertiesLocalitation))]
        public int RolId { get; set; }
    }

    public class UpdateUserRequest : CreateUserRequest
    {

        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        public int Id { get; set; }

        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        public override string Password { get => base.Password; set => base.Password = value; }
    }

    public class UserResponse
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public int RolId { get; set; }
    }
}
