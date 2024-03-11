using System;
using System.Collections.Generic;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class Rol
{
    public int Id { get; set; }

    public string Name { get; set; }

    public int? PermissionLevelId { get; set; }

    public bool Active { get; set; }

    public virtual ICollection<MenuXrol> MenuXrols { get; set; } = new List<MenuXrol>();

    public virtual RolPermissionsLevel PermissionLevel { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
