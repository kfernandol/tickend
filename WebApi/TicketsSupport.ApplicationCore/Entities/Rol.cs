using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class Rol
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public PermissionLevel PermissionLevel { get; set; }

    public bool Active { get; set; }

    public virtual ICollection<MenuXrol> MenuXrols { get; set; } = new List<MenuXrol>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
