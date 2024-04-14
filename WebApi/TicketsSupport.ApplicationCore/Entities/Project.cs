﻿using System;
using System.Collections.Generic;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class Project
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public byte[]? Photo { get; set; }

    public DateOnly? ExpirationSupportDate { get; set; }

    public bool Active { get; set; }

    public virtual ICollection<ProjectXclient> ProjectXclients { get; set; } = new List<ProjectXclient>();

    public virtual ICollection<ProjectXdeveloper> ProjectXdevelopers { get; set; } = new List<ProjectXdeveloper>();

    public virtual ICollection<ProjectXticketPriority> ProjectXticketPriorities { get; set; } = new List<ProjectXticketPriority>();

    public virtual ICollection<ProjectXticketStatus> ProjectXticketStatuses { get; set; } = new List<ProjectXticketStatus>();

    public virtual ICollection<ProjectXticketType> ProjectXticketTypes { get; set; } = new List<ProjectXticketType>();
}
