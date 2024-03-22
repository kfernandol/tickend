using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsSupport.ApplicationCore.Resources.Properties;

namespace TicketsSupport.ApplicationCore.DTOs
{
    public class CreateMenuRequest
    {
        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        [Display(Name = "MenuName", ResourceType = typeof(PropertiesLocalitation))]
        public string Name { get; set; }

        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        [Display(Name = "MenuUrl", ResourceType = typeof(PropertiesLocalitation))]
        public string Url { get; set; }

        [Display(Name = "MenuIcon", ResourceType = typeof(PropertiesLocalitation))]
        public string? Icon { get; set; }

        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        [Display(Name = "MenuPosition", ResourceType = typeof(PropertiesLocalitation))]
        public int Position { get; set; }

        [Display(Name = "MenuParent", ResourceType = typeof(PropertiesLocalitation))]
        public int? ParentId { get; set; }

        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        [Display(Name = "MenuShow", ResourceType = typeof(PropertiesLocalitation))]
        public bool Show { get; set; }
    }

    public class UpdateMenuRequest : CreateMenuRequest
    {
        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        public int Id { get; set; }
    }

    public class MenuResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string? Icon { get; set; }
        public int Position { get; set; }
        public int? ParentId { get; set; }
        public bool Show { get; set; }
    }
}
