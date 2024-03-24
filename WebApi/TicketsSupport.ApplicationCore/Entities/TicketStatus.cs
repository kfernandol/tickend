﻿using System;
using System.Collections.Generic;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class TicketStatus
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Color { get; set; } = null!;

    public bool? Active { get; set; }

    public virtual ICollection<ProjectXticketStatus> ProjectXticketStatuses { get; set; } = new List<ProjectXticketStatus>();
}