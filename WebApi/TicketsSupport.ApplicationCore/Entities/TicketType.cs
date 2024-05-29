using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class TicketType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Icon { get; set; } = null!;

    public string IconColor { get; set; } = null!;

    public int OrganizationId { get; set; }

    public bool Active { get; set; }

    public virtual Organization Organization { get; set; } = null!;

    public virtual ICollection<ProjectXticketType> ProjectXticketTypes { get; set; } = new List<ProjectXticketType>();

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
