using System;
using System.Collections.Generic;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class TicketType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Icon { get; set; } = null!;

    public string IconColor { get; set; } = null!;

    public bool Active { get; set; }

    public virtual ICollection<ProjectXticketType> ProjectXticketTypes { get; set; } = new List<ProjectXticketType>();
}
