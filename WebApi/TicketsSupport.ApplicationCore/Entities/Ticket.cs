using System;
using System.Collections.Generic;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class Ticket
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int ProjectId { get; set; }

    public int TicketTypeId { get; set; }

    public int? TicketPriorityId { get; set; }

    public int? TicketStatusId { get; set; }

    public bool IsClosed { get; set; }

    public DateTime DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public int CreateBy { get; set; }

    public bool Active { get; set; }

    public virtual User CreateByNavigation { get; set; } = null!;

    public virtual Project Project { get; set; } = null!;

    public virtual TicketPriority? TicketPriority { get; set; }

    public virtual TicketStatus? TicketStatus { get; set; }

    public virtual TicketType TicketType { get; set; } = null!;
}
