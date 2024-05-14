using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class ProjectXticketPriority
{
    public int Id { get; set; }

    public int ProjectId { get; set; }

    public int TicketPriorityId { get; set; }

    public virtual Project Project { get; set; } = null!;

    public virtual TicketPriority TicketPriority { get; set; } = null!;
}
