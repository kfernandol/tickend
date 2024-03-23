using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsSupport.ApplicationCore.Entities;
using TicketsSupport.ApplicationCore.Resources.Properties;

namespace TicketsSupport.ApplicationCore.DTOs
{
    public class CreateRolRequest
    {
        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        [Display(Name = "RolName", ResourceType = typeof(PropertiesLocalitation))]
        public string Name { get; set; } = null!;

        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        [Display(Name = "PermissionLevel", ResourceType = typeof(PropertiesLocalitation))]
        public PermissionLevel PermissionLevel { get; set; }

        [Display(Name = "Menus")]
        public List<int> Menus { get; set; }
    }

    public class UpdateRolRequest : CreateRolRequest
    {
        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        public int Id { get; set; }
    }

    public class RolResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string PermissionLevel { get; set; }
        public List<Menu> Menus { get; set; }
    }
}
