using System;
using System.Collections.Generic;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class TicketPriority
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Color { get; set; } = null!;

    public bool Active { get; set; }

    public virtual ICollection<ProjectXticketPriority> ProjectXticketPriorities { get; set; } = new List<ProjectXticketPriority>();
}
