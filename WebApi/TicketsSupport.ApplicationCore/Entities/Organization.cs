using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class Organization
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Photo { get; set; }

    public string? Address { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public DateTime CreateDate { get; set; }

    public bool Active { get; set; }

    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();

    public virtual ICollection<Menu> Menus { get; set; } = new List<Menu>();

    public virtual ICollection<OrganizationsXuser> OrganizationsXusers { get; set; } = new List<OrganizationsXuser>();

    public virtual ICollection<Project> Projects { get; set; } = new List<Project>();

    public virtual ICollection<Rol> Rols { get; set; } = new List<Rol>();

    public virtual ICollection<TicketPriority> TicketPriorities { get; set; } = new List<TicketPriority>();

    public virtual ICollection<TicketStatus> TicketStatuses { get; set; } = new List<TicketStatus>();

    public virtual ICollection<TicketType> TicketTypes { get; set; } = new List<TicketType>();

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
