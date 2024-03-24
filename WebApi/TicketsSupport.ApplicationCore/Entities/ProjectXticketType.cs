using System;
using System.Collections.Generic;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class ProjectXticketType
{
    public int Id { get; set; }

    public int ProjectId { get; set; }

    public int TicketTypeId { get; set; }

    public virtual Project Project { get; set; } = null!;

    public virtual TicketType TicketType { get; set; } = null!;
}
