using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class TicketPriority
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Color { get; set; } = null!;

    public int OrganizationId { get; set; }

    public bool Active { get; set; }

    public virtual Organization Organization { get; set; } = null!;

    public virtual ICollection<ProjectXticketPriority> ProjectXticketPriorities { get; set; } = new List<ProjectXticketPriority>();

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
