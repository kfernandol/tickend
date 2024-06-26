﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class Rol
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public PermissionLevel PermissionLevel { get; set; }

    public int OrganizationId { get; set; }

    public bool Active { get; set; }

    public virtual ICollection<MenuXrol> MenuXrols { get; set; } = new List<MenuXrol>();

    public virtual Organization Organization { get; set; } = null!;

    public virtual ICollection<RolXuser> RolXusers { get; set; } = new List<RolXuser>();
}
