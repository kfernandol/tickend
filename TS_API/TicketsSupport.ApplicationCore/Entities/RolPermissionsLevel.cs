using System;
using System.Collections.Generic;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class RolPermissionsLevel
{
    public int Id { get; set; }

    public string Name { get; set; }

    public int Level { get; set; }

    public virtual ICollection<Rol> Rols { get; set; } = new List<Rol>();
}
