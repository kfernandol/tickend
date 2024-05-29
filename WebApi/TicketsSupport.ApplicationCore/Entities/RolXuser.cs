using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class RolXuser
{
    public int Id { get; set; }

    public int? RolId { get; set; }

    public int? UserId { get; set; }

    public virtual Rol? Rol { get; set; }

    public virtual User? User { get; set; }
}
