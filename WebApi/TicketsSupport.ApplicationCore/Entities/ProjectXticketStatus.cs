using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class ProjectXticketStatus
{
    public int Id { get; set; }

    public int ProjectId { get; set; }

    public int TicketStatusId { get; set; }

    public virtual Project Project { get; set; } = null!;

    public virtual TicketStatus TicketStatus { get; set; } = null!;
}
