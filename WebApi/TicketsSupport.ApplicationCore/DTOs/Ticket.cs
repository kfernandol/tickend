using System.ComponentModel.DataAnnotations;
using TicketsSupport.ApplicationCore.Resources.Properties;

namespace TicketsSupport.ApplicationCore.DTOs
{
    public class CreateTicketRequest
    {
        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        [MaxLength(150, ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldMaxLength))]
        [Display(Name = "Title", ResourceType = typeof(PropertiesLocalitation))]
        public virtual string Title { get; set; }

        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        [Display(Name = "Description", ResourceType = typeof(PropertiesLocalitation))]
        public virtual string Description { get; set; }

        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        [Display(Name = "Project", ResourceType = typeof(PropertiesLocalitation))]
        public int ProjectId { get; set; }

        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        [Display(Name = "TicketType", ResourceType = typeof(PropertiesLocalitation))]
        public int TicketTypeId { get; set; }
    }

    public class UpdateTicketRequest : CreateTicketRequest
    {
        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        public int Id { get; set; }

        [Required(AllowEmptyStrings = true, ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        [MinLength(0, ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldMinLength))]
        public override string Title { get => base.Title; set => base.Title = value; }

        [Required(AllowEmptyStrings = true, ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        [MinLength(0, ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldMinLength))]
        public override string Description { get => base.Description; set => base.Description = value; }

        public int? TicketPriorityId { get; set; }

        public int? TicketStatusId { get; set; }

        public bool IsClosed { get; set; }
    }

    public class TicketResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int ProjectId { get; set; }
        public int TicketTypeId { get; set; }
        public int? TicketPriorityId { get; set; }
        public int? TicketStatusId { get; set; }
        public int? CreateBy { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public bool IsClosed { get; set; }
    }
}
