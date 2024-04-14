using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsSupport.ApplicationCore.Resources.Properties;

namespace TicketsSupport.ApplicationCore.DTOs
{
    public class CreateProjectRequest
    {
        public IFormFile? Photo { get; set; }

        [Required(ErrorMessageResourceType = typeof(PropertiesLocalitation), ErrorMessageResourceName = nameof(PropertiesLocalitation.FieldRequired))]
        public string Name { get; set; }

        public string Description { get; set; }

        public string? TicketStatusJson { get; set; }

        public string? TicketPrioritiesJson { get; set; }

        public string? TicketTypesJson { get; set; }

        public string? ClientsJson { get; set; }

        public string? DevelopersJson { get; set; }
    }

    public class UpdateProjectRequest : CreateProjectRequest
    {
        public int Id { get; set; }
    }

    public class ProjectResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Photo { get; set; }
        public string Description { get; set; }
        public List<int> TicketStatus { get; set; }
        public List<int> TicketPriorities { get; set; }
        public List<int> TicketTypes { get; set; }
        public List<int> Clients { get; set; }
        public List<int> Developers { get; set; }
    }
}
